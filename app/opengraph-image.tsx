import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'LNMIIT Placement Intelligence dashboard preview';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          color: '#f8fafc',
          background:
            'linear-gradient(135deg, #0b1220 0%, #111d35 62%, #173c83 100%)',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#24439b',
              fontSize: 28,
              fontWeight: 700
            }}
          >
            LN
          </div>
          <div style={{ fontSize: 23, color: '#bfdbfe' }}>
            THE LNM INSTITUTE OF INFORMATION TECHNOLOGY · JAIPUR
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 62, fontWeight: 700, letterSpacing: -2 }}>
            Placement Intelligence
          </div>
          <div style={{ fontSize: 30, color: '#cbd5e1' }}>
            LNMIIT placement data, recruiter records &amp; trends
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 112 }}>
          {[48, 72, 58, 95, 78, 105, 85, 110, 93, 72, 100, 88].map((height, index) => (
            <div
              key={index}
              style={{
                width: 46,
                height,
                borderRadius: '8px 8px 0 0',
                background: index % 3 === 0 ? '#60a5fa' : index % 3 === 1 ? '#2563eb' : '#93c5fd',
                opacity: 0.9
              }}
            />
          ))}
          <div
            style={{
              marginLeft: 'auto',
              marginBottom: 8,
              color: '#bfdbfe',
              fontSize: 23
            }}
          >
            LNMIIT · JAIPUR
          </div>
        </div>
      </div>
    ),
    size
  );
}
