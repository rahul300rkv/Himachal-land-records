import { Document, Page, Text, View } from '@react-pdf/renderer';

export type JamabandiData = {
  receiptNumber: string;
  labels: { id: string; value: string }[];
  parcelTable: { headers: string[]; rows: string[][] };
};

// Needs Hind registered at fontWeight 700 as well (see registerPdfFonts note).
const FONT = ['Hind', 'HindDeva'];
const bold = { fontWeight: 700 } as const;

// Column widths measured from the official nakal PDF.
const COLS = ['14.8%', '22.1%', '8.8%', '9.4%', '15.6%', '11.8%', '17.5%'];
const HEAD_COLS = ['18%', '28%', '21%', '33%'];

const headRows: [string, string][][] = [
  [['जिला', 'lblDis'], ['तहसील/उप-तहसील', 'lblTeh'], ['कानूनगो वृत', 'lblKanoongo'], ['पटवार वृत', 'lblPatwar']],
  [['राजस्व गांव', 'lblMohal'], ['हदबस्त नं.', 'lblHadbast'], ['जमाबंदी वर्ष', 'lblYear'], ['क्षेत्रफल इकाई', 'lblRakba']],
];

const lines: [string, string][] = [
  ['खाता नम्बर', 'lblKhewat'],
  ['नम्बरदार का नाम व पत्ती', 'lblNaam'],
  ['खाता पर लगने वाले कुल भू-राजस्व एवं स्वाई का विवरण', 'lblMutabla'],
  ['मालिक का पूर्ण विवरण', 'lblMalik'],
];

const WATERMARK_X = [151, 440, 683];

function today() {
  return new Date()
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
    .replace(/ /g, '-');
}

export function JamabandiCopy({ data }: { data: JamabandiData }) {
  const values = new Map(data.labels.map(({ id, value }) => [id.replace(/^ctl00_ContentPlaceHolder1_/, ''), value]));
  const val = (id: string) => values.get(id) || '—';

  return (
    <Document title="Jamabandi information copy" author="HimLand Check">
      <Page
        size="A4"
        orientation="landscape"
        style={{ fontFamily: FONT, fontSize: 9, paddingTop: 18, paddingLeft: 20, paddingRight: 16, paddingBottom: 62 }}
      >
        {/* Light "information only" watermark, drawn first so it sits behind the content */}
        {WATERMARK_X.map((cx) => (
          <View
            key={cx}
            fixed
            style={{ position: 'absolute', left: cx - 150, top: 330 - 35, width: 300, height: 70, justifyContent: 'center', transform: 'rotate(-90deg)' }}
          >
            <Text style={{ ...bold, fontSize: 34, lineHeight: 1.3, color: '#ebebeb', textAlign: 'center' }}>केवल जानकारी हेतु</Text>
          </View>
        ))}

        {/* Title box + receipt number */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 414, marginLeft: 11, borderWidth: 0.8, borderColor: '#000', paddingTop: 2, paddingBottom: 4 }}>
            <Text style={{ ...bold, fontSize: 14, lineHeight: 1.4, textAlign: 'center' }}>राजस्व विभाग, हिमाचल प्रदेश - नकल जमाबंदी</Text>
          </View>
          <Text style={{ ...bold, fontSize: 9.5, marginLeft: 203 }}>रसीद संख्या: {data.receiptNumber}</Text>
        </View>

        {/* Two header rows: bold label, regular value, no borders */}
        <View style={{ marginTop: 6 }}>
          {headRows.map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>
              {row.map(([label, id], c) => (
                <Text key={id} style={{ width: HEAD_COLS[c], fontSize: 9, paddingLeft: 3 }}>
                  <Text style={bold}>{label}: </Text>
                  {val(id)}
                </Text>
              ))}
            </View>
          ))}
        </View>
        <View style={{ borderBottomWidth: 1, borderColor: '#000', marginTop: 2 }} />

        {/* Khata summary lines */}
        <View style={{ marginTop: 4 }}>
          {lines.map(([label, id]) => (
            <Text key={id} style={{ fontSize: 9.5, marginTop: 4 }}>
              <Text style={bold}>{label} : </Text>
              {val(id)}
            </Text>
          ))}
        </View>

        {/* Parcel table: ruled header (repeats on every page), borderless rows */}
        <View style={{ marginTop: 8 }}>
          <View fixed style={{ flexDirection: 'row', borderTopWidth: 0.6, borderBottomWidth: 1, borderColor: '#000', paddingTop: 2, paddingBottom: 14 }}>
            {data.parcelTable.headers.map((header, i) => (
              <Text key={i} style={{ ...bold, width: COLS[i], fontSize: 7.5, paddingLeft: 2, paddingRight: 4 }}>{header}</Text>
            ))}
          </View>
          {data.parcelTable.rows.map((row, r) => (
            <View key={r} wrap={false} style={{ flexDirection: 'row', paddingTop: 3 }}>
              {row.map((cell, c) => (
                <Text key={c} style={{ width: COLS[c], fontSize: 8, paddingLeft: 2, paddingRight: 4 }}>{cell || ' '}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Footer: disclaimer, rule, then credit / date / page */}
        <Text fixed style={{ position: 'absolute', bottom: 34, left: 20, right: 16, fontSize: 7, color: '#555' }}>
          यह प्रति केवल प्राप्त अभिलेख की सूचनात्मक प्रस्तुति है। प्रमाणित सरकारी प्रति के लिए HimBhoomi से मूल दस्तावेज प्राप्त करें।
        </Text>
        <View fixed style={{ position: 'absolute', bottom: 28, left: 20, right: 16, borderTopWidth: 1, borderColor: '#000' }} />
        <Text fixed style={{ position: 'absolute', bottom: 14, left: 20, fontSize: 8.5 }}>HimLand Check — सूचनात्मक प्रति</Text>
        <Text fixed style={{ position: 'absolute', bottom: 14, left: 20, right: 16, fontSize: 8.5, textAlign: 'center' }}>दिनाँक: {today()}</Text>
        <Text
          fixed
          style={{ position: 'absolute', bottom: 14, left: 20, right: 16, fontSize: 8.5, textAlign: 'right' }}
          render={({ pageNumber }) => `पृष्ठ संख्या: ${pageNumber}`}
        />
      </Page>
    </Document>
  );
}