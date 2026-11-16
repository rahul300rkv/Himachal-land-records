#!/usr/bin/env python3
"""Resumable scraper for HimBhoomi's public pre-CAPTCHA dropdowns."""

from __future__ import annotations

import argparse
import csv
import random
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Iterator, Sequence
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

DEFAULT_BASE_URL = "https://himbhoomilmk.nic.in/"
RECORDS_PATH = "viewlandrecords.aspx"
FIELD = {
    "district": "ctl00$ContentPlaceHolder1$cmbdistrict",
    "tehsil": "ctl00$ContentPlaceHolder1$cmbtehsil",
    "village": "ctl00$ContentPlaceHolder1$cmbvillage",
    "year": "ctl00$ContentPlaceHolder1$cmbjyear",
    "record_type": "ctl00$ContentPlaceHolder1$rbtnJamShj",
    "record_key": "ctl00$ContentPlaceHolder1$RBLKKK",
}
SELECT_ID = {
    "district": "ctl00_ContentPlaceHolder1_cmbdistrict",
    "tehsil": "ctl00_ContentPlaceHolder1_cmbtehsil",
    "village": "ctl00_ContentPlaceHolder1_cmbvillage",
    "year": "ctl00_ContentPlaceHolder1_cmbjyear",
    "Khewat": "ctl00_ContentPlaceHolder1_DDLKhewat",
    "Khatauni": "ctl00_ContentPlaceHolder1_DDLKhatauni",
    "Khasra": "ctl00_ContentPlaceHolder1_DDLKhasra",
}
NUMBER_POSTBACK = {
    "Khewat": None,
    "Khatauni": "ctl00$ContentPlaceHolder1$RBLKKK$1",
    "Khasra": "ctl00$ContentPlaceHolder1$RBLKKK$2",
}
LOCATION_FIELDS = ["district_code", "district_name", "tehsil_code", "tehsil_name", "village_code", "village_name"]
YEAR_FIELDS = [*LOCATION_FIELDS, "year_value", "year_label"]
NUMBER_FIELDS = [*YEAR_FIELDS, "record_key", "number_value", "number_label"]
ERROR_FIELDS = ["phase", *YEAR_FIELDS, "message"]


@dataclass(frozen=True)
class Option:
    value: str
    label: str


@dataclass
class PageState:
    html: str
    selected: dict[str, str]


def clean_text(value: str) -> str:
    return " ".join(value.replace("\xa0", " ").split())


def option_list(html: str, select_id: str) -> list[Option]:
    select = BeautifulSoup(html, "html.parser").find("select", id=select_id)
    if select is None:
        return []
    return [
        Option(str(node.get("value", "")).strip(), clean_text(node.get_text(" ", strip=True)))
        for node in select.find_all("option")
        if str(node.get("value", "")).strip()
    ]


def hidden_fields(html: str) -> dict[str, str]:
    soup = BeautifulSoup(html, "html.parser")
    return {str(node["name"]): str(node.get("value", "")) for node in soup.select('input[type="hidden"][name]')}


def successful_fields(html: str) -> dict[str, str]:
    """Return the successful named controls a normal browser would post."""
    soup = BeautifulSoup(html, "html.parser")
    fields: dict[str, str] = {}
    for node in soup.select("input[name]"):
        if node.has_attr("disabled"):
            continue
        kind, name = str(node.get("type", "text")).lower(), str(node["name"])
        if kind in {"radio", "checkbox"}:
            if node.has_attr("checked"):
                fields[name] = str(node.get("value", ""))
        elif kind not in {"hidden", "submit", "button", "reset", "file", "image"}:
            fields[name] = str(node.get("value", ""))
    for node in soup.select("select[name]:not([disabled])"):
        selected = node.find("option", selected=True) or node.find("option")
        if selected is not None:
            fields[str(node["name"])] = str(selected.get("value", clean_text(selected.get_text(" "))))
    return fields


class HimBhoomiClient:
    def __init__(self, base_url: str, delay: float, timeout: float) -> None:
        self.records_url = urljoin(base_url.rstrip("/") + "/", RECORDS_PATH)
        self.delay, self.timeout = delay, timeout
        self.session = requests.Session()
        retry = Retry(total=4, connect=4, read=4, backoff_factor=1.0,
                      status_forcelist=(429, 500, 502, 503, 504),
                      allowed_methods=frozenset({"GET", "POST"}), raise_on_status=False)
        adapter = HTTPAdapter(max_retries=retry)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        self.session.headers.update({
            "User-Agent": "HimLand-Research/1.0 (public dropdown archival; low-rate)",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "hi-IN,hi;q=0.9,en-IN;q=0.8,en;q=0.7",
        })

    def pause(self) -> None:
        time.sleep(max(0.0, self.delay + random.uniform(0, self.delay * 0.2)))

    def start(self) -> PageState:
        response = self.session.get(self.records_url, timeout=self.timeout)
        response.raise_for_status()
        self.pause()
        return PageState(response.text, {})

    def postback(self, state: PageState, target: str, updates: dict[str, str]) -> PageState:
        selected = {**successful_fields(state.html), **state.selected, **updates}
        body = {**hidden_fields(state.html), **selected, "__EVENTTARGET": target, "__EVENTARGUMENT": ""}
        response = self.session.post(self.records_url, data=body,
                                     headers={"Referer": self.records_url}, timeout=self.timeout)
        response.raise_for_status()
        self.pause()
        return PageState(response.text, selected)

    def load(self, district: str, tehsil: str | None = None,
             village: str | None = None, year: str | None = None) -> PageState:
        state = self.start()
        state = self.postback(state, FIELD["district"], {FIELD["district"]: district})
        if tehsil is not None:
            state = self.postback(state, FIELD["tehsil"], {FIELD["tehsil"]: tehsil})
        if village is not None:
            state = self.postback(state, FIELD["village"], {FIELD["village"]: village})
        if year is not None:
            state = self.postback(state, FIELD["year"], {FIELD["year"]: year})
        return state


def read_keys(path: Path, columns: Sequence[str]) -> set[tuple[str, ...]]:
    if not path.exists():
        return set()
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return {tuple(row.get(column, "") for column in columns) for row in csv.DictReader(handle)}


def append_row(path: Path, fields: Sequence[str], row: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    new_file = not path.exists() or path.stat().st_size == 0
    with path.open("a", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        if new_file:
            writer.writeheader()
        writer.writerow(row)


def iter_csv(path: Path) -> Iterator[dict[str, str]]:
    if path.exists():
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            yield from csv.DictReader(handle)


def record_error(path: Path, phase: str, row: dict[str, str], error: Exception) -> None:
    append_row(path, ERROR_FIELDS, {**row, "phase": phase, "message": f"{type(error).__name__}: {error}"})


def scrape_locations(client: HimBhoomiClient, output: Path, errors: Path,
                     district_filter: set[str], limit: int | None) -> None:
    existing = read_keys(output, ("district_code", "tehsil_code", "village_code"))
    districts = option_list(client.start().html, SELECT_ID["district"])
    written = 0
    for district in districts:
        if district_filter and district.value not in district_filter and district.label not in district_filter:
            continue
        print(f"District {district.value}: {district.label}", flush=True)
        try:
            tehsils = option_list(client.load(district.value).html, SELECT_ID["tehsil"])
        except Exception as error:
            record_error(errors, "tehsils", {"district_code": district.value, "district_name": district.label}, error)
            continue
        for tehsil in tehsils:
            print(f"  Tehsil {tehsil.value}: {tehsil.label}", flush=True)
            try:
                villages = option_list(client.load(district.value, tehsil.value).html, SELECT_ID["village"])
            except Exception as error:
                record_error(errors, "villages", {"district_code": district.value, "district_name": district.label,
                                                   "tehsil_code": tehsil.value, "tehsil_name": tehsil.label}, error)
                continue
            for village in villages:
                key = (district.value, tehsil.value, village.value)
                if key in existing:
                    continue
                append_row(output, LOCATION_FIELDS, {
                    "district_code": district.value, "district_name": district.label,
                    "tehsil_code": tehsil.value, "tehsil_name": tehsil.label,
                    "village_code": village.value, "village_name": village.label,
                })
                existing.add(key)
                written += 1
                if limit is not None and written >= limit:
                    return


def scrape_years(client: HimBhoomiClient, locations: Path, output: Path,
                 errors: Path, limit: int | None) -> None:
    existing = read_keys(output, ("district_code", "tehsil_code", "village_code", "year_value"))
    for index, location in enumerate(iter_csv(locations), start=1):
        try:
            state = client.load(location["district_code"], location["tehsil_code"], location["village_code"])
            for year in option_list(state.html, SELECT_ID["year"]):
                key = (location["district_code"], location["tehsil_code"], location["village_code"], year.value)
                if key not in existing:
                    append_row(output, YEAR_FIELDS, {**location, "year_value": year.value, "year_label": year.label})
                    existing.add(key)
        except Exception as error:
            record_error(errors, "years", location, error)
        if limit is not None and index >= limit:
            return


def latest_year_rows(rows: Iterable[dict[str, str]], all_years: bool) -> Iterator[dict[str, str]]:
    if all_years:
        yield from rows
        return
    seen: set[tuple[str, str, str]] = set()
    for row in rows:
        key = (row["district_code"], row["tehsil_code"], row["village_code"])
        if key not in seen:
            seen.add(key)
            yield row


def scrape_numbers(client: HimBhoomiClient, years: Path, output: Path, errors: Path,
                   record_keys: Sequence[str], all_years: bool, limit: int | None) -> None:
    unique = ("district_code", "tehsil_code", "village_code", "year_value", "record_key", "number_value")
    existing = read_keys(output, unique)
    for index, row in enumerate(latest_year_rows(iter_csv(years), all_years), start=1):
        try:
            base = client.load(row["district_code"], row["tehsil_code"], row["village_code"], row["year_value"])
            for record_key in record_keys:
                state, target = base, NUMBER_POSTBACK[record_key]
                if target is not None:
                    state = client.postback(state, target, {
                        FIELD["record_type"]: "J", FIELD["record_key"]: record_key,
                    })
                for number in option_list(state.html, SELECT_ID[record_key]):
                    key = (row["district_code"], row["tehsil_code"], row["village_code"],
                           row["year_value"], record_key, number.value)
                    if key not in existing:
                        append_row(output, NUMBER_FIELDS, {**row, "record_key": record_key,
                                                          "number_value": number.value,
                                                          "number_label": number.label})
                        existing.add(key)
        except Exception as error:
            record_error(errors, "numbers", row, error)
        if limit is not None and index >= limit:
            return


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--depth", choices=("locations", "years", "numbers"), default="locations",
                        help="locations is cheapest; numbers is most expensive")
    parser.add_argument("--output-dir", type=Path, default=Path("data/himbhoomi"))
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--delay", type=float, default=0.75)
    parser.add_argument("--timeout", type=float, default=40.0)
    parser.add_argument("--district", action="append", default=[],
                        help="official code or exact Hindi label; repeatable")
    parser.add_argument("--record-keys", nargs="+", choices=tuple(NUMBER_POSTBACK), default=["Khewat"])
    parser.add_argument("--all-years", action="store_true",
                        help="numbers depth defaults to the latest year per village")
    parser.add_argument("--max-villages", type=int, help="small test/resume batch size")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.delay < 0 or args.timeout <= 0 or (args.max_villages is not None and args.max_villages <= 0):
        raise SystemExit("delay must be >= 0; timeout and max-villages must be > 0")
    root: Path = args.output_dir
    locations, years = root / "locations.csv", root / "years.csv"
    numbers, errors = root / "record_numbers.csv", root / "errors.csv"
    client = HimBhoomiClient(args.base_url, args.delay, args.timeout)
    print(f"Output: {root.resolve()} | depth={args.depth}")
    scrape_locations(client, locations, errors, set(args.district), args.max_villages)
    if args.depth in {"years", "numbers"}:
        scrape_years(client, locations, years, errors, args.max_villages)
    if args.depth == "numbers":
        scrape_numbers(client, years, numbers, errors, args.record_keys, args.all_years, args.max_villages)
    print("Done. Re-run the same command to resume; existing CSV keys are skipped.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("\nStopped safely. Re-run the command to resume.", file=sys.stderr)
        raise SystemExit(130)
