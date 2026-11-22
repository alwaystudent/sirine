import React, { useState } from 'react';
import { CheckCircle2, Compass, Lightbulb, MapPin, Shapes, Zap } from 'lucide-react';
import { FrameBlossom } from './FrameBlossom';

type LabTab = 'geometry' | 'circuit' | 'tunisia';

interface TunisiaSite {
  id: string;
  name: string;
  governorate: string;
  landmark: string;
  fact: string;
  specialty: string;
  cx: number;
  cy: number;
}

const TUNISIA_SITES: TunisiaSite[] = [
  {
    id: 'carthage',
    name: 'قرطاج التاريخيّة',
    governorate: 'ولاية تونس',
    landmark: 'موقع قرطاج الأثري وسيدي بوسعيد',
    fact: 'أسّستها الأميرة الفينيقية عليسة سنة 814 قبل الميلاد، وتطلّ على خليج تونس.',
    specialty: 'معالم تاريخية · ساحل متوسطي',
    cx: 155,
    cy: 42,
  },
  {
    id: 'beja',
    name: 'باجة الخضراء',
    governorate: 'ولاية باجة',
    landmark: 'تلال الحبوب وواد مجردة',
    fact: 'تُلقّب بمطمورة روما لخصوبة سهولها وإنتاجها الوفير للقمح والأجبان التقليدية.',
    specialty: 'زراعة الحبوب · الشمال الغربي',
    cx: 112,
    cy: 48,
  },
  {
    id: 'kairouan',
    name: 'القيروان',
    governorate: 'ولاية القيروان',
    landmark: 'جامع عقبة بن نافع',
    fact: 'أسّسها عقبة بن نافع سنة 50 هجري، وهي أول مدينة إسلامية في المغرب العربي وعاصمة الزربية.',
    specialty: 'الزربية القيروانية · المقروض',
    cx: 140,
    cy: 110,
  },
  {
    id: 'eljem',
    name: 'الجمّ',
    governorate: 'ولاية المهدية',
    landmark: 'المسرح الروماني بالجمّ',
    fact: 'يُعدّ قصر الجمّ ثالث أكبر مسرح روماني في العالم ومن أروع الشواهد المعمارية بتونس.',
    specialty: 'الساحل التونسي · زيت الزيتون',
    cx: 175,
    cy: 122,
  },
  {
    id: 'gabes',
    name: 'قابس',
    governorate: 'ولاية قابس',
    landmark: 'الواحة البحرية بشننّي',
    fact: 'تتميّز قابس بكونها واحة بحرية فريدة في العالم حيث يلتقي النخيل بمياه البحر الأبيض المتوسط.',
    specialty: 'الواحات البحرية · الرمّان والتمور',
    cx: 148,
    cy: 205,
  },
];

type MaterialId = 'copper' | 'gold' | 'wood' | 'plastic';

const MATERIALS: Record<
  MaterialId,
  { label: string; conductive: boolean; note: string }
> = {
  copper: {
    label: 'نحاس (معدن)',
    conductive: true,
    note: 'النحاس مادة موصلة ممتازة تسمح بمرور التيار الكهربائي.',
  },
  gold: {
    label: 'فضة / ذهب (معدن)',
    conductive: true,
    note: 'المعادن مثل الذهب والفضة موصلة للكهرباء وتغلق الدارة.',
  },
  wood: {
    label: 'خشب جاف',
    conductive: false,
    note: 'الخشب الجاف مادة عازلة تمنع مرور التيار الكهربائي.',
  },
  plastic: {
    label: 'بلاستيك',
    conductive: false,
    note: 'البلاستيك مادة عازلة تُستعمل لتغليف الأسلاك وحمايتنا.',
  },
};

export const ConceptLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTab>('geometry');

  // Tab 1: Geometry & Fractions State
  const [rectWidth, setRectWidth] = useState(6);
  const [rectHeight, setRectHeight] = useState(4);
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);

  // Tab 2: Simple Electric Circuit State
  const [switchClosed, setSwitchClosed] = useState(true);
  const [material, setMaterial] = useState<MaterialId>('copper');

  // Tab 3: Tunisia Geography State
  const [selectedSiteId, setSelectedSiteId] = useState<string>('carthage');

  const selectedSite =
    TUNISIA_SITES.find((s) => s.id === selectedSiteId) ?? TUNISIA_SITES[0];
  const currentMaterial = MATERIALS[material];
  const bulbLit = switchClosed && currentMaterial.conductive;

  const area = rectWidth * rectHeight;
  const perimeter = (rectWidth + rectHeight) * 2;
  const clampedNumerator = Math.min(numerator, denominator);
  const fractionDecimal = (clampedNumerator / denominator).toFixed(2);

  return (
    <section id="concept-lab" className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-base font-bold text-[#DB2777] mb-1">
            تعلّم تطبيقي · السنة الخامسة ابتدائي
          </p>
          <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#2D1B2E] leading-snug">
            مختبر المفاهيم التفاعلي
          </h2>
        </div>

        {/* Interactive Segmented Tab Controls */}
        <div
          role="tablist"
          aria-label="أدوات المختبر التفاعلي"
          className="inline-flex flex-wrap items-center gap-1 p-1.5 bg-[#FBF2F6] border border-[#F0D9E4] rounded-xl"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'geometry'}
            onClick={() => setActiveTab('geometry')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'geometry'
                ? 'bg-white text-[#DB2777] shadow-xs'
                : 'text-[#432F46] hover:text-[#2D1B2E]'
            }`}
          >
            <Shapes className="w-4 h-4" />
            <span>الكسور والمساحة</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'circuit'}
            onClick={() => setActiveTab('circuit')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'circuit'
                ? 'bg-white text-[#059669] shadow-xs'
                : 'text-[#432F46] hover:text-[#2D1B2E]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>الدارة الكهربائية</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tunisia'}
            onClick={() => setActiveTab('tunisia')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tunisia'
                ? 'bg-white text-[#B45309] shadow-xs'
                : 'text-[#432F46] hover:text-[#2D1B2E]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>خريطة معالم تونس</span>
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Stage */}
      <div
        style={
          (activeTab === 'geometry'
            ? {
                '--rim-from': '#EAA8C5',
                '--rim-mid': '#D4BFF2',
                '--rim-to': '#F3D79B',
              }
            : activeTab === 'circuit'
              ? {
                  '--rim-from': '#9ADBC2',
                  '--rim-mid': '#A8D8F0',
                  '--rim-to': '#F3D79B',
                }
              : {
                  '--rim-from': '#EED091',
                  '--rim-mid': '#EAA8C5',
                  '--rim-to': '#D4BFF2',
                }) as React.CSSProperties
        }
        className="relative srayna-top-frame rounded-2xl p-6 sm:p-8"
      >
        <FrameBlossom
          size="lg"
          accentHex={
            activeTab === 'geometry'
              ? '#7C3AED'
              : activeTab === 'circuit'
                ? '#059669'
                : '#D97706'
          }
        />
        {activeTab === 'geometry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Visual Stage */}
            <div className="lg:col-span-7 bg-[#FFF9FB] border border-[#F4DCE6] rounded-xl p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm font-semibold text-[#2D1B2E] mb-3">
                  <span>تمثيل المستطيل ({rectWidth} صم × {rectHeight} صم)</span>
                  <span className="text-[#7C3AED] tabular-nums">
                    المساحة = {area} صم² · المحيط = {perimeter} صم
                  </span>
                </div>
                <div className="flex items-center justify-center py-4 overflow-x-auto">
                  <div
                    className="grid gap-1 bg-[#EDE9FE] p-2 rounded-lg border border-[#C4B5FD]"
                    style={{
                      gridTemplateColumns: `repeat(${rectWidth}, minmax(26px, 34px))`,
                    }}
                  >
                    {Array.from({ length: rectWidth * rectHeight }).map((_, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded bg-[#7C3AED]/85 border border-white/60"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-[#F4DCE6]">
                <div className="flex items-center justify-between text-sm font-semibold text-[#2D1B2E] mb-3">
                  <span>شريط الكسر التفاعلي</span>
                  <span className="text-[#DB2777] font-latin tabular-nums">
                    {clampedNumerator} / {denominator} = {fractionDecimal}
                  </span>
                </div>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${denominator}, 1fr)` }}>
                  {Array.from({ length: denominator }).map((_, idx) => {
                    const filled = idx < clampedNumerator;
                    return (
                      <div
                        key={idx}
                        className={`h-10 rounded-lg border transition-colors ${
                          filled
                            ? 'bg-[#DB2777] border-[#BE185D]'
                            : 'bg-white border-[#F0D9E4]'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Control & Concept Deck */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#2D1B2E] mb-1">
                  جرّبي تغيير الأبعاد والكسور
                </h3>
                <p className="text-base font-semibold text-[#432F46] leading-relaxed">
                  حرّكي المزالج لتشاهدي كيف يتغيّر المحيط والمساحة وقيمة الكسر العشرية.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-1.5">
                    <label htmlFor="width-slider">طول المستطيل</label>
                    <span className="tabular-nums text-[#7C3AED]">{rectWidth} صم</span>
                  </div>
                  <input
                    id="width-slider"
                    type="range"
                    min={2}
                    max={9}
                    value={rectWidth}
                    onChange={(e) => setRectWidth(Number(e.target.value))}
                    className="w-full accent-[#7C3AED] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold mb-1.5">
                    <label htmlFor="height-slider">عرض المستطيل</label>
                    <span className="tabular-nums text-[#7C3AED]">{rectHeight} صم</span>
                  </div>
                  <input
                    id="height-slider"
                    type="range"
                    min={1}
                    max={5}
                    value={rectHeight}
                    onChange={(e) => setRectHeight(Number(e.target.value))}
                    className="w-full accent-[#7C3AED] cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-[#F4DCE6] space-y-3">
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1.5">
                      <label htmlFor="num-slider">البسط (الأجزاء الملوّنة)</label>
                      <span className="tabular-nums text-[#DB2777]">{clampedNumerator}</span>
                    </div>
                    <input
                      id="num-slider"
                      type="range"
                      min={1}
                      max={denominator}
                      value={clampedNumerator}
                      onChange={(e) => setNumerator(Number(e.target.value))}
                      className="w-full accent-[#DB2777] cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-1.5">
                      <label htmlFor="den-slider">المقام (مجموع الأجزاء)</label>
                      <span className="tabular-nums text-[#DB2777]">{denominator}</span>
                    </div>
                    <input
                      id="den-slider"
                      type="range"
                      min={2}
                      max={10}
                      value={denominator}
                      onChange={(e) => {
                        const nextDen = Number(e.target.value);
                        setDenominator(nextDen);
                        if (numerator > nextDen) setNumerator(nextDen);
                      }}
                      className="w-full accent-[#DB2777] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'circuit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Circuit Stage */}
            <div className="lg:col-span-7 bg-[#FFF9FB] border border-[#F4DCE6] rounded-xl p-6 flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="text-base font-extrabold text-[#2D1B2E]">مخطط الدارة الكهربائية البسيطة</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-extrabold px-3 py-1 rounded-lg ${
                    bulbLit
                      ? 'bg-[#ECFDF5] text-[#059669]'
                      : 'bg-[#FFFBEB] text-[#B45309]'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>
                    {bulbLit ? 'الدارة مغلقة · المصباح مضيء' : 'التيار متوقّف · المصباح منطفئ'}
                  </span>
                </span>
              </div>

              <svg
                viewBox="0 0 360 210"
                className="w-full max-w-md h-auto"
                role="img"
                aria-label="رسم تفاعلي للدارة الكهربائية"
              >
                {/* Wires */}
                <path
                  d="M70 155 L70 55 L155 55 M205 55 L290 55 L290 155 L215 155 M145 155 L70 155"
                  fill="none"
                  stroke={bulbLit ? '#059669' : '#9CA3AF'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Battery (Left) */}
                <rect x="44" y="88" width="52" height="36" rx="6" fill="#FFFFFF" stroke="#2D1B2E" strokeWidth="2.5" />
                <text x="70" y="111" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2D1B2E">
                  بطارية 4.5V
                </text>

                {/* Bulb (Top Center) */}
                <circle
                  cx="180"
                  cy="55"
                  r="24"
                  fill={bulbLit ? '#FDE047' : '#F3F4F6'}
                  stroke={bulbLit ? '#CA8A04' : '#6B7280'}
                  strokeWidth="3"
                />
                <path
                  d="M172 58 Q180 42 188 58"
                  fill="none"
                  stroke={bulbLit ? '#B45309' : '#9CA3AF'}
                  strokeWidth="2.5"
                />

                {/* Material Test Bridge (Right-Bottom) */}
                <rect
                  x="145"
                  y="141"
                  width="70"
                  height="28"
                  rx="6"
                  fill={currentMaterial.conductive ? '#D1FAE5' : '#FEE2E2'}
                  stroke={currentMaterial.conductive ? '#059669' : '#DC2626'}
                  strokeWidth="2"
                />
                <text x="180" y="159" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2D1B2E">
                  {material === 'copper'
                    ? 'نحاس'
                    : material === 'gold'
                      ? 'ذهب'
                      : material === 'wood'
                        ? 'خشب'
                        : 'بلاستيك'}
                </text>

                {/* Switch Indicator (Right Vertical Wire) */}
                <circle cx="290" cy="88" r="5" fill="#2D1B2E" />
                <circle cx="290" cy="126" r="5" fill="#2D1B2E" />
                <line
                  x1="290"
                  y1="126"
                  x2={switchClosed ? '290' : '316'}
                  y2="88"
                  stroke="#DB2777"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <text x="320" y="110" fontSize="11" fontWeight="700" fill="#5C475E">
                  القاطعة
                </text>
              </svg>
            </div>

            {/* Circuit Controls */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#2D1B2E] mb-1">
                  اختبري المواد الموصلة والعازلة
                </h3>
                <p className="text-base font-semibold text-[#432F46] leading-relaxed">
                  أغلقي القاطعة وجرّبي وضع مواد مختلفة داخل الدارة لاكتشاف متى يضيء المصباح.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#FBF2F6] border border-[#F0D9E4]">
                <span className="font-bold text-[#2D1B2E]">حالة القاطعة:</span>
                <button
                  type="button"
                  onClick={() => setSwitchClosed((prev) => !prev)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    switchClosed
                      ? 'bg-[#059669] text-white'
                      : 'bg-white border border-[#D1D5DB] text-[#2D1B2E]'
                  }`}
                >
                  {switchClosed ? 'مغلقة (يمرّ التيار)' : 'مفتوحة (لا يمرّ التيار)'}
                </button>
              </div>

              <div>
                <div className="text-sm font-bold text-[#2D1B2E] mb-2.5">
                  اختاري مادة الاختبار:
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.keys(MATERIALS) as MaterialId[]).map((matKey) => {
                    const active = material === matKey;
                    return (
                      <button
                        key={matKey}
                        type="button"
                        onClick={() => setMaterial(matKey)}
                        className={`px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#FDF2F8] border-[#DB2777] text-[#9D174D]'
                            : 'bg-white border-[#F0D9E4] text-[#2D1B2E] hover:bg-[#FFF9FB]'
                        }`}
                      >
                        {MATERIALS[matKey].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border flex items-start gap-2.5 text-sm ${
                  currentMaterial.conductive
                    ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                    : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{currentMaterial.note}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tunisia' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Stylized Interactive Map of Tunisia */}
            <div className="lg:col-span-6 bg-[#FFF9FB] border border-[#F4DCE6] rounded-xl p-6 flex flex-col items-center">
              <div className="text-sm font-bold text-[#2D1B2E] mb-3">
                اضغطي على إحدى المدن التونسية لاكتشاف معالمها
              </div>
              <svg
                viewBox="0 0 260 280"
                className="w-full max-w-[260px] h-auto"
                role="img"
                aria-label="خريطة تفاعلية لمعالم تونس"
              >
                {/* Sea backdrop */}
                <rect x="0" y="0" width="260" height="280" rx="16" fill="#E0F2FE" opacity="0.55" />
                {/* Stylized Tunisia Silhouette */}
                <path
                  d="M115 18 L156 18 L175 40 L165 65 L182 95 L192 128 L176 165 L162 195 L186 218 L150 262 L120 262 L92 220 L84 172 L95 130 L85 88 L92 46 Z"
                  fill="#FEF3C7"
                  stroke="#D97706"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {TUNISIA_SITES.map((site) => {
                  const isActive = site.id === selectedSite.id;
                  return (
                    <g
                      key={site.id}
                      onClick={() => setSelectedSiteId(site.id)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={site.cx}
                        cy={site.cy}
                        r={isActive ? 11 : 8}
                        fill={isActive ? '#DB2777' : '#FFFFFF'}
                        stroke="#DB2777"
                        strokeWidth="2.5"
                      />
                      <text
                        x={site.cx - 14}
                        y={site.cy + 4}
                        textAnchor="end"
                        fontSize="11"
                        fontWeight="700"
                        fill="#2D1B2E"
                      >
                        {site.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Governorate Info Deck */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap gap-2">
                {TUNISIA_SITES.map((site) => (
                  <button
                    key={site.id}
                    type="button"
                    onClick={() => setSelectedSiteId(site.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      site.id === selectedSite.id
                        ? 'bg-[#DB2777] border-[#DB2777] text-white'
                        : 'bg-white border-[#F0D9E4] text-[#2D1B2E] hover:bg-[#FDF2F8]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{site.name}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-[#FFF9FB] border border-[#F0D9E4] space-y-3">
                <div className="text-sm font-extrabold text-[#B45309]">
                  {selectedSite.governorate} · {selectedSite.specialty}
                </div>
                <h3 className="text-xl font-extrabold text-[#2D1B2E]">{selectedSite.landmark}</h3>
                <p className="text-base font-semibold text-[#432F46] leading-relaxed">{selectedSite.fact}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
