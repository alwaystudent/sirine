import { Exercise, SubjectId, UnitKind } from '../types/education';

function makeMathExercises(topicIndex: number, kind: UnitKind): Exercise[] {
  const seed = kind === 'lesson' ? 1 : kind === 'activity' ? 2 : 3;
  const pts = kind === 'exam' ? 20 : 15;

  switch (topicIndex) {
    case 0: {
      // Millions & Place value
      const m = 2 + seed;
      const k = 300 + seed * 50;
      const u = 10 * seed + 5;
      const fullNum = `${m} ${k} 0${u}`;
      const compactNum = `${m}${k}0${u}`;
      return [
        {
          id: `math-0-${kind}-1`,
          type: 'choice',
          prompt: `ما هي القيمة المنزلية للرقم ${k.toString()[0]} في العدد ${m} ${k} 410 ؟`,
          hint: 'احسبي الرتب من اليمين: آحاد، عشرات، مئات، آحاد الآلاف...',
          explanation: `الرقم يقع في رتبة مئات الآلاف، لذا قيمته ${Number(k.toString()[0]) * 100} 000.`,
          points: pts,
          options: [
            `${Number(k.toString()[0]) * 10} 000`,
            `${Number(k.toString()[0]) * 100} 000`,
            `${Number(k.toString()[0])} 000 000`,
            `${Number(k.toString()[0])} 000`,
          ],
          correctIndex: 1,
        },
        {
          id: `math-0-${kind}-2`,
          type: 'fill_blank',
          prompt: 'أكملي تفكيك العدد التالي:',
          sentenceBefore: `${fullNum} = ${m} 000 000 + `,
          sentenceAfter: ` + ${u}`,
          hint: 'انظري إلى منزلة الآلاف في العدد.',
          explanation: `منزلة الآلاف تساوي ${k} 000.`,
          points: pts,
          wordBank: [`${k} 000`, `${k}00`, `${k * 10}`, `${m} 000`],
          correctAnswers: [`${k} 000`],
        },
        {
          id: `math-0-${kind}-3`,
          type: 'input',
          prompt: `اكتبي بالأرقام العدد: ${m} ملايين و ${k} ألفاً و ${u} (بدون فراغات).`,
          hint: `في الملايين ${m}، وفي الآلاف ${k}، وفي الوحدات 0${u}.`,
          explanation: `الكتابة الرقمية الصحيحة هي ${compactNum}.`,
          points: pts,
          correctAnswers: [compactNum, fullNum],
          inputPlaceholder: 'اكتبي العدد بالأرقام',
          quickKeys: ['0', '1', '2', '3', '4', '5'],
        },
      ];
    }
    case 1: {
      // Comparing & ordering large numbers
      const base = 400000 + seed * 100000;
      const a = base + 12450;
      const b = base + 52100;
      const c = base + 98000;
      const d = base + 605000;
      const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return [
        {
          id: `math-1-${kind}-1`,
          type: 'order',
          prompt: 'اسحبي الأعداد ورتّبيها تصاعدياً (من الأصغر إلى الأكبر):',
          hint: 'قارني الأرقام بدءاً من منزلة مئات الآلاف في اليسار.',
          explanation: `الترتيب الصحيح: ${fmt(a)} ثم ${fmt(b)} ثم ${fmt(c)} ثم ${fmt(d)}.`,
          points: 20,
          correctOrder: [fmt(a), fmt(b), fmt(c), fmt(d)],
        },
        {
          id: `math-1-${kind}-2`,
          type: 'boolean',
          prompt: `العدد ${fmt(c)} أكبر من العدد ${fmt(b)}.`,
          hint: 'قارني رقم عشرات الآلاف في العددين.',
          explanation: `صحيح، لأن ${fmt(c)} > ${fmt(b)}.`,
          points: 10,
          correctBoolean: true,
        },
        {
          id: `math-1-${kind}-3`,
          type: 'match',
          prompt: 'طابقي كل مقارنة بالرمز الصحيح:',
          hint: 'قارني عدد الأرقام أولاً.',
          explanation: 'الأكبر يفتح فمه نحو العدد الأكبر.',
          points: 20,
          pairs: [
            { id: 'cmp1', left: `${fmt(d)} ... ${fmt(a)}`, right: 'أكبر من (>)' },
            { id: 'cmp2', left: `${fmt(a)} ... ${fmt(b)}`, right: 'أصغر من (<)' },
            { id: 'cmp3', left: `${fmt(c)} ... ${fmt(c)}`, right: 'يساوي (=)' },
          ],
        },
      ];
    }
    case 2: {
      // Addition & Subtraction + Tunisian Dinar
      const p1 = 12 + seed * 2;
      const m1 = 400;
      const p2 = 8 + seed;
      const m2 = 750;
      const totalMil = (p1 + p2) * 1000 + m1 + m2;
      const totalD = Math.floor(totalMil / 1000);
      const remM = totalMil % 1000;
      const changeMil = 50000 - totalMil;
      const chD = Math.floor(changeMil / 1000);
      const chM = changeMil % 1000;
      return [
        {
          id: `math-2-${kind}-1`,
          type: 'choice',
          prompt: `اشترت سيرين كتاباً بـ ${p1} ديناراً و${m1} مليماً ومقلمة بـ ${p2} ديناراً و${m2} مليماً. كم أنفقت؟`,
          hint: 'حوّلي المبالغ إلى المليم أو اجمعي المليمات (400 + 750 = 1150 مليم).',
          explanation: `المجموع = ${totalD} ديناراً و${remM} مليماً.`,
          points: pts,
          options: [
            `${totalD - 1} ديناراً و${remM} مليماً`,
            `${totalD} ديناراً و${remM} مليماً`,
            `${totalD} ديناراً و350 مليماً`,
            `${totalD + 1} ديناراً و${remM} مليماً`,
          ],
          correctIndex: 1,
        },
        {
          id: `math-2-${kind}-2`,
          type: 'fill_blank',
          prompt: 'إذا دفعت سيرين ورقة نقدية من فئة 50 ديناراً، فكم يرجع لها البائع؟',
          sentenceBefore: 'الباقي الذي يرجع لسيرين هو ',
          sentenceAfter: ` و${chM} مليماً.`,
          hint: `اطرحي ${totalD} ديناراً و${remM} مليماً من 50 ديناراً.`,
          explanation: `50 000 - ${totalMil} = ${changeMil} مليم، أي ${chD} ديناراً و${chM} مليماً.`,
          points: pts,
          wordBank: [`${chD} ديناراً`, `${chD + 1} ديناراً`, `${chD - 2} ديناراً`, `${totalD} ديناراً`],
          correctAnswers: [`${chD} ديناراً`],
        },
        {
          id: `math-2-${kind}-3`,
          type: 'input',
          prompt: `احسبي: ${1250 + seed * 100} + ${750 + seed * 50} =`,
          hint: 'اجمعي الآحاد ثم العشرات ثم المئات والآلاف.',
          explanation: `الناتج الصحيح هو ${1250 + seed * 100 + 750 + seed * 50}.`,
          points: pts,
          correctAnswers: [String(1250 + seed * 100 + 750 + seed * 50)],
          inputPlaceholder: 'اكتبي الناتج',
          quickKeys: ['0', '1', '2', '3', '4', '5'],
        },
      ];
    }
    case 3: {
      // Multiplication
      const a = 24 + seed * 3;
      const b = 12 + seed;
      const prod = a * b;
      return [
        {
          id: `math-3-${kind}-1`,
          type: 'input',
          prompt: `في مدرسة سيرين ${b} قسماً، في كل قسم ${a} تلميذة. كم عدد التلميذات الإجمالي؟`,
          hint: `اضربي ${a} × ${b}.`,
          explanation: `${a} × ${b} = ${prod} تلميذة.`,
          points: pts,
          correctAnswers: [String(prod)],
          inputPlaceholder: 'اكتبي العدد',
          quickKeys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        {
          id: `math-3-${kind}-2`,
          type: 'match',
          prompt: 'طابقي كل عملية ضرب بناتجها:',
          hint: 'استعملي الضرب الذهني السريع.',
          explanation: '15 × 20 = 300، 25 × 4 = 100، 12 × 30 = 360.',
          points: 20,
          pairs: [
            { id: 'mul1', left: '15 × 20', right: '300' },
            { id: 'mul2', left: '25 × 4', right: '100' },
            { id: 'mul3', left: '12 × 30', right: '360' },
          ],
        },
        {
          id: `math-3-${kind}-3`,
          type: 'boolean',
          prompt: 'ناتج ضرب أي عدد صحيح في 100 ينتهي دائماً بصفرين على الأقل.',
          hint: 'جرّبي 14 × 100 = 1400.',
          explanation: 'صحيح! عند الضرب في 100 نضيف صفرين إلى يمين العدد الصحيح.',
          points: 10,
          correctBoolean: true,
        },
      ];
    }
    case 4: {
      // Euclidean division
      const divisor = 7 + seed;
      const quotient = 11 + seed;
      const rem = seed + 2;
      const dividend = divisor * quotient + rem;
      return [
        {
          id: `math-4-${kind}-1`,
          type: 'input',
          prompt: `وزّعت سيرين ${dividend} زهرة ياسمين في باقات، كل باقة بها ${divisor} زهرات. كم زهرة بقيت؟`,
          hint: `ابحثي عن أقرب مضاعف للعدد ${divisor} أصغر من ${dividend}.`,
          explanation: `${dividend} = (${divisor} × ${quotient}) + ${rem}، إذن الباقي ${rem} زهرات.`,
          points: pts,
          correctAnswers: [String(rem)],
          inputPlaceholder: 'الباقي',
          quickKeys: ['1', '2', '3', '4', '5', '6'],
        },
        {
          id: `math-4-${kind}-2`,
          type: 'fill_blank',
          prompt: 'أتمّي المساواة الإقليدية التالية:',
          sentenceBefore: `${dividend} = (${divisor} × `,
          sentenceAfter: `) + ${rem}`,
          hint: `اقسمي ${dividend - rem} على ${divisor}.`,
          explanation: `خارج القسمة هو ${quotient}.`,
          points: pts,
          wordBank: [String(quotient), String(quotient + 1), String(quotient - 1), String(rem)],
          correctAnswers: [String(quotient)],
        },
        {
          id: `math-4-${kind}-3`,
          type: 'boolean',
          prompt: `في القسمة الإقليدية على ${divisor}، يمكن أن يكون الباقي ${divisor + 1}.`,
          hint: 'قارني الباقي مع المقسوم عليه.',
          explanation: `خطأ! الباقي دائماً أصغر من ${divisor}.`,
          points: 10,
          correctBoolean: false,
        },
      ];
    }
    case 5: {
      // Multiples & Divisors
      return [
        {
          id: `math-5-${kind}-1`,
          type: 'classify',
          prompt: 'اسحبي كل عدد إلى المجموعة المناسبة (يقبل القسمة على 5 أم على 2 فقط):',
          hint: 'مضاعفات 5 تنتهي بـ 0 أو 5، ومضاعفات 2 تنتهي برقم زوجي.',
          explanation: 'الأعداد 35 و 105 تقبل القسمة على 5، بينما 24 و 48 تقبل على 2.',
          points: 20,
          buckets: ['من مضاعفات 5', 'يقبل على 2 (وليس 5)'],
          classifyItems: [
            { id: 'div1', label: '35', bucketIndex: 0 },
            { id: 'div2', label: '24', bucketIndex: 1 },
            { id: 'div3', label: '105', bucketIndex: 0 },
            { id: 'div4', label: '48', bucketIndex: 1 },
          ],
        },
        {
          id: `math-5-${kind}-2`,
          type: 'choice',
          prompt: 'أيّ الأعداد التالية يقبل القسمة على 3 في الوقت نفسه؟',
          hint: 'اجمعي أرقام كل عدد: يجب أن يكون من مضاعفات 3.',
          explanation: 'مجموع أرقام 123 هو 1 + 2 + 3 = 6 وهو من مضاعفات 3.',
          points: pts,
          options: ['122', '123', '124', '125'],
          correctIndex: 1,
        },
        {
          id: `math-5-${kind}-3`,
          type: 'boolean',
          prompt: 'العدد 60 يقبل القسمة على 2 و 3 و 5 معاً.',
          hint: 'رقم آحاده 0 ومجموع أرقامه 6.',
          explanation: 'صحيح! 60 عدد زوجي آحاده 0 ومجموع أرقامه 6.',
          points: 10,
          correctBoolean: true,
        },
      ];
    }
    case 6: {
      // Fractions
      return [
        {
          id: `math-6-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل كسر مع العدد العشري المساوي له:',
          hint: '1/2 هو النصف (0.5) و 1/4 هو الربع (0.25).',
          explanation: '1/2 = 0.5، 1/4 = 0.25، 3/4 = 0.75، 1/5 = 0.2.',
          points: 20,
          pairs: [
            { id: 'fr1', left: '1/2', right: '0.5' },
            { id: 'fr2', left: '1/4', right: '0.25' },
            { id: 'fr3', left: '3/4', right: '0.75' },
            { id: 'fr4', left: '1/5', right: '0.2' },
          ],
        },
        {
          id: `math-6-${kind}-2`,
          type: 'choice',
          prompt: `مع سيرين ${12 * seed} قطعة حلوى، أكلت رُبعها (1/4). كم قطعة أكلت؟`,
          hint: 'اقسمي العدد الإجمالي على 4.',
          explanation: `${12 * seed} ÷ 4 = ${3 * seed} قطع حلوى.`,
          points: pts,
          options: [
            `${2 * seed} قطع`,
            `${3 * seed} قطع`,
            `${4 * seed} قطع`,
            `${6 * seed} قطع`,
          ],
          correctIndex: 1,
        },
        {
          id: `math-6-${kind}-3`,
          type: 'fill_blank',
          prompt: 'أكملي جمع الكسرين ذوي المقام الموحّد:',
          sentenceBefore: '2/7 + 3/7 = ',
          sentenceAfter: '',
          hint: 'نجمع البسطين ونحتفظ بالمقام نفسه (7).',
          explanation: '2/7 + 3/7 = 5/7.',
          points: pts,
          wordBank: ['5/7', '5/14', '6/7', '1/7'],
          correctAnswers: ['5/7'],
        },
      ];
    }
    case 7: {
      // Decimals classification & ordering
      return [
        {
          id: `math-7-${kind}-1`,
          type: 'classify',
          prompt: 'اسحبي كل عدد إلى مجموعته الصحيحة:',
          hint: 'العدد العشري له جزء عشري بعد الفاصلة.',
          explanation: '15 و 204 أعداد صحيحة، بينما 4.25 و 0.8 أعداد عشرية.',
          points: 20,
          buckets: ['عدد صحيح طبيعي', 'عدد عشري'],
          classifyItems: [
            { id: 'dc1', label: '15', bucketIndex: 0 },
            { id: 'dc2', label: '4.25', bucketIndex: 1 },
            { id: 'dc3', label: '204', bucketIndex: 0 },
            { id: 'dc4', label: '0.8', bucketIndex: 1 },
          ],
        },
        {
          id: `math-7-${kind}-2`,
          type: 'order',
          prompt: 'اسحبي الأعداد العشرية ورتّبيها من الأصغر إلى الأكبر:',
          hint: 'قارني الجزء الصحيح ثم رقم الأعشار.',
          explanation: 'الترتيب الصحيح: 2.09 ← 2.45 ← 2.5 ← 3.12.',
          points: 20,
          correctOrder: ['2.09', '2.45', '2.5', '3.12'],
        },
      ];
    }
    case 8: {
      // Adding & Subtracting Decimals
      const x = 10 + seed * 2 + 0.6;
      const y = 4 + seed + 0.4;
      const sum = Math.round((x + y) * 10) / 10;
      return [
        {
          id: `math-8-${kind}-1`,
          type: 'input',
          prompt: `احسبي مجموع العددين العشريين: ${x} + ${y} =`,
          hint: '6 أعشار + 4 أعشار = 10 أعشار = 1 وحدة كاملة.',
          explanation: `${x} + ${y} = ${sum}.`,
          points: pts,
          correctAnswers: [String(sum), `${sum}.0`],
          inputPlaceholder: 'الناتج',
          quickKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'],
        },
        {
          id: `math-8-${kind}-2`,
          type: 'choice',
          prompt: 'احسبي الفرق: 10 - 3.75 =',
          hint: 'اكتبي 10 على شكل 10.00 ثم اطرحي.',
          explanation: '10.00 - 3.75 = 6.25.',
          points: pts,
          options: ['7.25', '6.25', '6.75', '7.75'],
          correctIndex: 1,
        },
      ];
    }
    case 9: {
      // Multiply decimals by 10, 100, 1000
      return [
        {
          id: `math-9-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل عملية ضرب بناتجها الصحيح:',
          hint: 'الضرب في 10 يزيح الفاصلة برتبة نحو اليمين، وفي 100 برتبتين.',
          explanation: '3.45 × 10 = 34.5، 3.45 × 100 = 345، 0.7 × 1000 = 700.',
          points: 20,
          pairs: [
            { id: 'p10-1', left: '3.45 × 10', right: '34.5' },
            { id: 'p10-2', left: '3.45 × 100', right: '345' },
            { id: 'p10-3', left: '0.7 × 1000', right: '700' },
          ],
        },
        {
          id: `math-9-${kind}-2`,
          type: 'fill_blank',
          prompt: 'املئي الفراغ لتحصلي على مساواة صحيحة:',
          sentenceBefore: '6.25 × ',
          sentenceAfter: ' = 625',
          hint: 'تحركت الفاصلة برتبتين نحو اليمين.',
          explanation: 'لإزاحة الفاصلة رتبتين إلى اليمين نضرب في 100.',
          points: pts,
          wordBank: ['10', '100', '1000', '5'],
          correctAnswers: ['100'],
        },
      ];
    }
    case 10: {
      // Geometry: lines & angles
      return [
        {
          id: `math-10-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي قياس الزوايا التالية إلى «زاوية حادّة (< 90°)» أو «زاوية منفرجة (> 90°)»:',
          hint: 'الزاوية القائمة قياسها 90° تماماً.',
          explanation: '45° و 75° حادّتان؛ 110° و 140° منفرجتان.',
          points: 20,
          buckets: ['زاوية حادّة (< 90°)', 'زاوية منفرجة (> 90°)'],
          classifyItems: [
            { id: 'ang1', label: '45°', bucketIndex: 0 },
            { id: 'ang2', label: '110°', bucketIndex: 1 },
            { id: 'ang3', label: '75°', bucketIndex: 0 },
            { id: 'ang4', label: '140°', bucketIndex: 1 },
          ],
        },
        {
          id: `math-10-${kind}-2`,
          type: 'boolean',
          prompt: 'المستقيمان المتوازيان يحافظان على البعد نفسه بينهما ولا يتقاطعان أبداً.',
          hint: 'تأمّلي خطّي السكة الحديدية.',
          explanation: 'صحيح! المستقيمان المتوازيان لا يتقاطعان مهما امتدّا.',
          points: 10,
          correctBoolean: true,
        },
        {
          id: `math-10-${kind}-3`,
          type: 'boolean',
          prompt: 'في التناظر المحوري، يحافظ الشكل النظير على الأطوال والأبعاد نفسها.',
          hint: 'عند طيّ الورقة على محور التناظر ينطبق الشكلان تماماً.',
          explanation: 'صحيح! التناظر المحوري يحفظ الأبعاد والمساحات والزوايا.',
          points: 10,
          correctBoolean: true,
        },
      ];
    }
    case 11: {
      // Perimeter & Area
      const side = 10 + seed * 5;
      const sqPerim = side * 4;
      const len = 20 + seed * 5;
      const wid = 10 + seed * 2;
      const rectArea = len * wid;
      return [
        {
          id: `math-11-${kind}-1`,
          type: 'input',
          prompt: `حديقة مربّعة طول ضلعها ${side} متراً. احسبي محيطها بالمتر.`,
          hint: 'محيط المربّع = الضلع × 4.',
          explanation: `${side} × 4 = ${sqPerim} متراً.`,
          points: pts,
          correctAnswers: [String(sqPerim)],
          inputPlaceholder: 'المحيط بالمتر',
          quickKeys: ['0', '2', '4', '6', '8'],
        },
        {
          id: `math-11-${kind}-2`,
          type: 'fill_blank',
          prompt: 'أكملي حساب مساحة المستطيل:',
          sentenceBefore: `مستطيل طوله ${len} م وعرضه ${wid} م، مساحته تساوي `,
          sentenceAfter: ' م².',
          hint: 'مساحة المستطيل = الطول × العرض.',
          explanation: `${len} × ${wid} = ${rectArea} م².`,
          points: pts,
          wordBank: [String(rectArea), String((len + wid) * 2), String(len + wid), String(rectArea + 50)],
          correctAnswers: [String(rectArea)],
        },
      ];
    }
    case 12: {
      // Units conversion
      return [
        {
          id: `math-12-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل قياس بما يساويه:',
          hint: '1 كم = 1000 م، 1 كغ = 1000 غ، 1 م = 100 صم.',
          explanation: '2 كم = 2000 م، 3.5 كغ = 3500 غ، 4 م = 400 صم.',
          points: 20,
          pairs: [
            { id: 'u1', left: '2 كم', right: '2000 م' },
            { id: 'u2', left: '3.5 كغ', right: '3500 غ' },
            { id: 'u3', left: '4 م', right: '400 صم' },
          ],
        },
        {
          id: `math-12-${kind}-2`,
          type: 'input',
          prompt: `حوّلي إلى المليلتر: ${seed} لتر = ...... مل`,
          hint: 'كل 1 لتر يساوي 1000 مليلتر.',
          explanation: `${seed} ل = ${seed * 1000} مل.`,
          points: pts,
          correctAnswers: [String(seed * 1000)],
          inputPlaceholder: 'العدد بالمليلتر',
          quickKeys: ['0', '1', '2', '3'],
        },
      ];
    }
    case 13: {
      // Time
      return [
        {
          id: `math-13-${kind}-1`,
          type: 'choice',
          prompt: 'انطلقت حافلة الرحلة المدرسية على الساعة 07:35 ووصلت بعد 45 دقيقة. متى وصلت؟',
          hint: 'أضيفي 25 دقيقة لتصل إلى 08:00 ثم أضيفي الـ 20 دقيقة الباقية.',
          explanation: '07:35 + 45 دقيقة = 08:20.',
          points: pts,
          options: ['08:15', '08:20', '08:10', '08:25'],
          correctIndex: 1,
        },
        {
          id: `math-13-${kind}-2`,
          type: 'fill_blank',
          prompt: 'حوّلي الساعات إلى الدقائق:',
          sentenceBefore: 'ساعتان وربع تساوي ',
          sentenceAfter: ' دقيقة.',
          hint: 'الساعتان = 120 دقيقة، والربع ساعة = 15 دقيقة.',
          explanation: '120 + 15 = 135 دقيقة.',
          points: pts,
          wordBank: ['125', '135', '145', '150'],
          correctAnswers: ['135'],
        },
      ];
    }
    default: {
      // Proportion & Word problems
      const unitPrice = 2 + seed;
      const qty1 = 3;
      const qty2 = 7;
      return [
        {
          id: `math-14-${kind}-1`,
          type: 'input',
          prompt: `ثمن ${qty1} كراسات متماثلة هو ${unitPrice * qty1} دنانير. ما ثمن ${qty2} كراسات من نفس النوع؟`,
          hint: 'احسبي ثمن الكراس الواحد أولاً بالقسمة، ثم اضربي في 7.',
          explanation: `ثمن الكراس = ${unitPrice} دينار، وثمن ${qty2} كراسات = ${unitPrice * qty2} ديناراً.`,
          points: pts,
          correctAnswers: [String(unitPrice * qty2)],
          inputPlaceholder: 'الثمن بالدينار',
          quickKeys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        {
          id: `math-14-${kind}-2`,
          type: 'choice',
          prompt: 'قطعت سيارة 180 كلم في ساعتين. كم تقطع في 3 ساعات بنفس السرعة؟',
          hint: 'احسبي المسافة في ساعة واحدة (180 ÷ 2).',
          explanation: 'في ساعة تقطع 90 كلم، وفي 3 ساعات تقطع 90 × 3 = 270 كلم.',
          points: pts,
          options: ['240 كلم', '270 كلم', '300 كلم', '210 كلم'],
          correctIndex: 1,
        },
      ];
    }
  }
}

function makeArabicExercises(topicIndex: number, kind: UnitKind): Exercise[] {
  const pts = kind === 'exam' ? 20 : 15;
  switch (topicIndex) {
    case 0:
      return [
        {
          id: `ar-0-${kind}-1`,
          type: 'fill_blank',
          prompt: 'املئي الفراغ بخبر مناسب مرفوع:',
          sentenceBefore: 'حديقةُ المدرسةِ ',
          sentenceAfter: ' بالأزهار.',
          hint: 'الخبر يكون مرفوعاً بالضمة.',
          explanation: '«جميلةٌ» خبر مرفوع بالضمة الظاهرة.',
          points: pts,
          wordBank: ['جميلةٌ', 'جميلةً', 'جميلةٍ', 'جميلاً'],
          correctAnswers: ['جميلةٌ'],
        },
        {
          id: `ar-0-${kind}-2`,
          type: 'order',
          prompt: 'اسحبي الكلمات لترتيب جملة اسمية صحيحة:',
          hint: 'ابدئي بالمبتدأ المعرّف ثم الخبر.',
          explanation: 'التلميذةُ المجتهدةُ محبوبةٌ.',
          points: 20,
          correctOrder: ['التلميذةُ', 'المجتهدةُ', 'محبوبةٌ'],
        },
      ];
    case 1:
      return [
        {
          id: `ar-1-${kind}-1`,
          type: 'choice',
          prompt: 'اختاري الشكل الصحيح للخبر بعد «أصبح»: «أصبحَ الجوُّ ......»',
          hint: 'أصبح من أخوات كان، وخبرها منصوب.',
          explanation: '«أصبح» ترفع المبتدأ وتنصب الخبر: «لطيفاً».',
          points: pts,
          options: ['لطيفٌ', 'لطيفاً', 'لطيفٍ', 'لطيفُ'],
          correctIndex: 1,
        },
        {
          id: `ar-1-${kind}-2`,
          type: 'classify',
          prompt: 'صنّفي النواسخ التالية إلى نواسخ فعلية ونواسخ حرفية:',
          hint: 'أخوات كان أفعال، وأخوات إنّ حروف.',
          explanation: 'أصبح وظلّ من أخوات كان؛ ليت ولعلّ من أخوات إنّ.',
          points: 20,
          buckets: ['ناسخ فعلي (أخوات كان)', 'ناسخ حرفي (أخوات إنّ)'],
          classifyItems: [
            { id: 'ar_c1', label: 'أصبحَ', bucketIndex: 0 },
            { id: 'ar_c2', label: 'لعلّ', bucketIndex: 1 },
            { id: 'ar_c3', label: 'ظلّ', bucketIndex: 0 },
            { id: 'ar_c4', label: 'ليتَ', bucketIndex: 1 },
          ],
        },
      ];
    case 2:
      return [
        {
          id: `ar-2-${kind}-1`,
          type: 'fill_blank',
          prompt: 'املئي الفراغ باسم «إنّ» المنصوب:',
          sentenceBefore: 'إنّ ',
          sentenceAfter: ' متفوّقةٌ في دروسها.',
          hint: 'اسم «إنّ» منصوب بالفتحة.',
          explanation: '«إنّ سيرينَ» أو «إنّ التلميذةَ» منصوب بالفتحة.',
          points: pts,
          wordBank: ['التلميذةَ', 'التلميذةُ', 'التلميذةِ', 'تلميذةٌ'],
          correctAnswers: ['التلميذةَ'],
        },
        {
          id: `ar-2-${kind}-2`,
          type: 'order',
          prompt: 'رتّبي الجملة المنسوخة بـ «لعلّ»:',
          hint: 'لعلّ + اسمها المنصوب + خبرها المرفوع.',
          explanation: 'لعلّ السماءَ ممطرةٌ اليومَ.',
          points: 20,
          correctOrder: ['لعلّ', 'السماءَ', 'ممطرةٌ', 'اليومَ'],
        },
      ];
    case 3:
      return [
        {
          id: `ar-3-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل كلمة في الجملة «رسمتْ سيرينُ لوحةً» بوظيفتها:',
          hint: 'من قام بالرسم؟ وماذا رسمت؟',
          explanation: 'رسمتْ فعل ماضٍ، سيرينُ فاعل مرفوع، لوحةً مفعول به منصوب.',
          points: 20,
          pairs: [
            { id: 'arf1', left: 'رسمتْ', right: 'فعل ماضٍ' },
            { id: 'arf2', left: 'سيرينُ', right: 'فاعل مرفوع' },
            { id: 'arf3', left: 'لوحةً', right: 'مفعول به منصوب' },
          ],
        },
        {
          id: `ar-3-${kind}-2`,
          type: 'boolean',
          prompt: 'المفعول به يكون دائماً مرفوعاً بالضمة.',
          hint: 'تأمّلي حركة آخر كلمة «لوحةً».',
          explanation: 'خطأ! المفعول به يكون دائماً منصوباً.',
          points: 10,
          correctBoolean: false,
        },
      ];
    case 4:
      return [
        {
          id: `ar-4-${kind}-1`,
          type: 'choice',
          prompt: 'ما وظيفة كلمة «رغبةً» في جملة: «تراجعُ سيرينُ دروسَها رغبةً في النجاح»؟',
          hint: 'اسألي: لماذا تراجع سيرين دروسها؟',
          explanation: '«رغبةً» مفعول لأجله منصوب لأنه يبيّن سبب وقوع الفعل.',
          points: pts,
          options: ['فاعل', 'مفعول لأجله', 'مبتدأ', 'حرف جر'],
          correctIndex: 1,
        },
        {
          id: `ar-4-${kind}-2`,
          type: 'fill_blank',
          prompt: 'أكملي الجملة بمفعول مطلق مناسب:',
          sentenceBefore: 'فرحتُ بنجاحي ',
          sentenceAfter: ' عظيماً.',
          hint: 'مصدر مشتقّ من الفعل «فرح».',
          explanation: 'فرحتُ فرحاً عظيماً.',
          points: pts,
          wordBank: ['فرحاً', 'صباحاً', 'أمامَ', 'تحت'],
          correctAnswers: ['فرحاً'],
        },
      ];
    case 5:
      return [
        {
          id: `ar-5-${kind}-1`,
          type: 'fill_blank',
          prompt: 'املئي الفراغ بنعت مطابق للمنعوت:',
          sentenceBefore: 'قطفتْ سيرينُ وردتينِ ',
          sentenceAfter: ' من الحديقة.',
          hint: 'المنعوت مثنّى مؤنث منصوب.',
          explanation: '«جميلتينِ» نعت يتبع المنعوت في التثنية والتأنيث والنصب.',
          points: pts,
          wordBank: ['جميلتينِ', 'جميلتانِ', 'جميلةً', 'جميلاتٍ'],
          correctAnswers: ['جميلتينِ'],
        },
        {
          id: `ar-5-${kind}-2`,
          type: 'boolean',
          prompt: 'يتبع النعتُ المنعوتَ في الإعراب والنوع والعدد.',
          hint: 'إذا كان المنعوت مرفوعاً ماذا يكون النعت؟',
          explanation: 'صحيح! النعت يطابق منعوته دائماً.',
          points: 10,
          correctBoolean: true,
        },
      ];
    case 6:
      return [
        {
          id: `ar-6-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي الأفعال الصحيحة إلى «سالم» أو «مهموز»:',
          hint: 'المهموز أحد حروفه الأصلية همزة.',
          explanation: 'كَتَبَ وجَلَسَ سالمان؛ سَأَلَ وقَرَأَ مهموزان.',
          points: 20,
          buckets: ['فعل صحيح سالم', 'فعل صحيح مهموز'],
          classifyItems: [
            { id: 'ars1', label: 'كَتَبَ', bucketIndex: 0 },
            { id: 'ars2', label: 'قَرَأَ', bucketIndex: 1 },
            { id: 'ars3', label: 'جَلَسَ', bucketIndex: 0 },
            { id: 'ars4', label: 'سَأَلَ', bucketIndex: 1 },
          ],
        },
      ];
    case 7:
      return [
        {
          id: `ar-7-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل فعل معتلّ بنوعه الصحيح:',
          hint: 'حدّدي موضع حرف العلّة (الأول أم الوسط أم الآخر).',
          explanation: 'وَصَلَ مثال، قَالَ أجوف، رَمَى ناقص.',
          points: 20,
          pairs: [
            { id: 'arm1', left: 'وَصَلَ', right: 'معتل مثال' },
            { id: 'arm2', left: 'قَالَ', right: 'معتل أجوف' },
            { id: 'arm3', left: 'رَمَى', right: 'معتل ناقص' },
          ],
        },
      ];
    case 8:
      return [
        {
          id: `ar-8-${kind}-1`,
          type: 'choice',
          prompt: 'صرّفي الفعل «رَمَى» مع الضمير «هنّ» في الماضي:',
          hint: 'تُردّ الألف اللينة إلى الياء.',
          explanation: 'هنّ رَمَيْنَ.',
          points: pts,
          options: ['رموا', 'رمتْ', 'رمينَ', 'يرمون'],
          correctIndex: 2,
        },
        {
          id: `ar-8-${kind}-2`,
          type: 'fill_blank',
          prompt: 'املئي الفراغ بالفعل المصرف في المضارع:',
          sentenceBefore: 'التلميذاتُ ',
          sentenceAfter: ' دروسهنّ بنشاط.',
          hint: 'الضمير «هنّ» في المضارع يأخذ نون النسوة.',
          explanation: 'التلميذاتُ يراجعنَ دروسهنّ.',
          points: pts,
          wordBank: ['يراجعنَ', 'يراجعون', 'تراجع', 'نراجع'],
          correctAnswers: ['يراجعنَ'],
        },
      ];
    case 9:
      return [
        {
          id: `ar-9-${kind}-1`,
          type: 'input',
          prompt: 'اكتبي فعل الأمر من «كَتَبَ» للمفردة المؤنثة (أنتِ):',
          hint: 'أنتِ ...... الدرسَ.',
          explanation: 'فعل الأمر للمفردة المخاطبة هو: اكتبي.',
          points: pts,
          correctAnswers: ['اكتبي', 'أكتبي'],
          inputPlaceholder: 'اكتبي الفعل',
        },
        {
          id: `ar-9-${kind}-2`,
          type: 'choice',
          prompt: 'اختاري صيغة الأمر الصحيحة لـ «سَارَ» مع «أنتِ»:',
          hint: 'نحذف حرف العلّة عند التسكين أو نثبته مع ياء المخاطبة.',
          explanation: 'مع أنتِ نقول: سِيري في طريق العلم.',
          points: pts,
          options: ['سِرْ', 'سِيري', 'ساروا', 'يسير'],
          correctIndex: 1,
        },
      ];
    case 10:
      return [
        {
          id: `ar-10-${kind}-1`,
          type: 'fill_blank',
          prompt: 'املئي الفراغ بالرسم الإملائي الصحيح للهمزة المتوسطة:',
          sentenceBefore: 'ترتفعُ ',
          sentenceAfter: ' الجامع الكبير في القيروان.',
          hint: 'ما قبل الهمزة مكسور، والكسرة أقوى الحركات.',
          explanation: 'تُكتب «مِئْذنة» على النبرة.',
          points: pts,
          wordBank: ['مئذنةُ', 'مأذنةُ', 'مؤذنةُ', 'مءذنةُ'],
          correctAnswers: ['مئذنةُ'],
        },
        {
          id: `ar-10-${kind}-2`,
          type: 'boolean',
          prompt: 'تُكتب الهمزة في كلمة «فُؤَاد» على الواو لأن الضمة أقوى من الفتحة.',
          hint: 'قارني بين الضمة والفتحة.',
          explanation: 'صحيح! الضمة أقوى من الفتحة فتُكتب على الواو.',
          points: 10,
          correctBoolean: true,
        },
      ];
    case 11:
      return [
        {
          id: `ar-11-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل كلمة بسبب رسم همزتها المتطرفة:',
          hint: 'انظري إلى حركة الحرف الذي قبل الهمزة الأخيرة.',
          explanation: 'شاطئ على الياء لأن الطاء مكسورة، لؤلؤ على الواو لأن اللام مضمومة، سماء على السطر بعد المد.',
          points: 20,
          pairs: [
            { id: 'hz1', left: 'شاطِئ', right: 'ما قبلها مكسور' },
            { id: 'hz2', left: 'لُؤْلُؤ', right: 'ما قبلها مضموم' },
            { id: 'hz3', left: 'سَماء', right: 'ما قبلها حرف مد ساكن' },
          ],
        },
      ];
    case 12:
      return [
        {
          id: `ar-12-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي الكلمات التالية حسب نوع التاء في آخرها:',
          hint: 'الاسم المفرد المؤنث تكتب تاؤه مربوطة.',
          explanation: 'مدرسة وزهرة بتاء مربوطة؛ كتبتْ ومعلّمات بتاء مبسوطة.',
          points: 20,
          buckets: ['تاء مربوطة (ة / ـة)', 'تاء مبسوطة (ت)'],
          classifyItems: [
            { id: 'taa1', label: 'مدرسة', bucketIndex: 0 },
            { id: 'taa2', label: 'كتبتْ', bucketIndex: 1 },
            { id: 'taa3', label: 'زهرة', bucketIndex: 0 },
            { id: 'taa4', label: 'معلّمات', bucketIndex: 1 },
          ],
        },
      ];
    case 13:
      return [
        {
          id: `ar-13-${kind}-1`,
          type: 'choice',
          prompt: 'لماذا كُتبت الألف ممدودة في الفعل «دَعَا» ومقصورة في «رَمَى»؟',
          hint: 'حوّليهما إلى المضارع: يدعو / يرمي.',
          explanation: 'دعا مضارعه يدعو (أصلها واو)، ورمى مضارعه يرمي (أصلها ياء).',
          points: pts,
          options: [
            'لأن أصل ألف دعا واو وأصل ألف رمى ياء',
            'تُكتب عشوائياً',
            'لأنهما أسماء',
            'لأنهما في الأمر',
          ],
          correctIndex: 0,
        },
      ];
    default:
      return [
        {
          id: `ar-14-${kind}-1`,
          type: 'order',
          prompt: 'رتّبي الجمل التالية لتكوين فقرة قصيرة متماسكة:',
          hint: 'ابدئي بالزمن ثم الزيارة ثم ما أعجب سيرين.',
          explanation: 'صباح الأحد ← زارت سيرين القيروان ← أعجبت بزرابيها الملوّنة ← وعادت سعيدة.',
          points: 20,
          correctOrder: [
            'في صباح الأحد،',
            'زارت سيرين مدينة القيروان',
            'وأعجبت بزرابيها الملوّنة،',
            'ثم عادت سعيدةً إلى بيتها.',
          ],
        },
        {
          id: `ar-14-${kind}-2`,
          type: 'choice',
          prompt: '«تزدهرُ مدينةُ القيروان بالصناعاتِ التقليديّةِ.» ما مرادف «تزدهر»؟',
          hint: 'كلمة تدل على التقدم والنمو.',
          explanation: '«تزدهر» تعني تتطوّر وتنمو.',
          points: pts,
          options: ['تتراجع', 'تتطوّر وتنمو', 'تختفي', 'تصغر'],
          correctIndex: 1,
        },
      ];
  }
}

function makeScienceExercises(topicIndex: number, kind: UnitKind): Exercise[] {
  const pts = kind === 'exam' ? 20 : 15;
  switch (topicIndex) {
    case 0:
      return [
        {
          id: `sci-0-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي الأغذية التالية إلى «أغذية بانية» أو «أغذية واقية (فيتامينات)»:',
          hint: 'اللحم والبيض يبنيان الجسم، والخضر والغلال تقيه من الأمراض.',
          explanation: 'السمك والبيض أغذية بانية، والبرتقال والسبانخ أغذية واقية.',
          points: 20,
          buckets: ['أغذية بانية (بروتينات)', 'أغذية واقية (فيتامينات)'],
          classifyItems: [
            { id: 'food1', label: 'البيض والسمك', bucketIndex: 0 },
            { id: 'food2', label: 'البرتقال والتفاح', bucketIndex: 1 },
            { id: 'food3', label: 'اللحوم والبقول', bucketIndex: 0 },
            { id: 'food4', label: 'الخضر الورقية', bucketIndex: 1 },
          ],
        },
      ];
    case 1:
      return [
        {
          id: `sci-1-${kind}-1`,
          type: 'order',
          prompt: 'رتّبي مسار الطعام داخل الجهاز الهضمي:',
          hint: 'يبدأ الهضم بالمضغ في الفم.',
          explanation: 'الفم ← المريء ← المعدة ← الأمعاء الدقيقة.',
          points: 20,
          correctOrder: ['الفم', 'المريء', 'المعدة', 'الأمعاء الدقيقة'],
        },
      ];
    case 2:
      return [
        {
          id: `sci-2-${kind}-1`,
          type: 'fill_blank',
          prompt: 'املئي الفراغ بالغاز المناسب:',
          sentenceBefore: 'يمتصّ الجسم أثناء الشهيق غاز ',
          sentenceAfter: ' الضروري للحياة.',
          hint: 'غاز تحمله كريات الدم الحمراء.',
          explanation: 'يمتصّ الجسم الأكسجين ويطرح ثاني أكسيد الكربون.',
          points: pts,
          wordBank: ['الأكسجين', 'ثاني أكسيد الكربون', 'النيتروجين', 'الهيليوم'],
          correctAnswers: ['الأكسجين'],
        },
        {
          id: `sci-2-${kind}-2`,
          type: 'order',
          prompt: 'رتّبي مسار الهواء أثناء الشهيق:',
          hint: 'من الأنف نحو الرئتين.',
          explanation: 'الأنف ← البلعوم ← القصبة الهوائية ← الرئتان.',
          points: 20,
          correctOrder: ['الأنف', 'البلعوم', 'القصبة الهوائية', 'الرئتان'],
        },
      ];
    case 3:
      return [
        {
          id: `sci-3-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل عنصر في جهاز الدوران بوظيفته:',
          hint: 'ما العضو الذي يضخ؟ وما الأوعية التي تنقل؟',
          explanation: 'القلب يضخ الدم، الشرايين تنقله من القلب للأعضاء، والأوردة تعيده.',
          points: 20,
          pairs: [
            { id: 'bl1', left: 'القلب', right: 'ضخّ الدم باستمرار' },
            { id: 'bl2', left: 'الشرايين', right: 'نقل الدم من القلب إلى الأعضاء' },
            { id: 'bl3', left: 'الأوردة', right: 'إرجاع الدم إلى القلب' },
          ],
        },
      ];
    case 4:
      return [
        {
          id: `sci-4-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل حاسّة بعضوها المسؤول:',
          hint: 'حواسنا الخمس نوافذنا على العالم.',
          explanation: 'العين للبصر، الأذن للسمع، الأنف للشم، اللسان للذوق.',
          points: 20,
          pairs: [
            { id: 'sn1', left: 'العين', right: 'حاسّة البصر' },
            { id: 'sn2', left: 'الأذن', right: 'حاسّة السمع' },
            { id: 'sn3', left: 'الأنف', right: 'حاسّة الشمّ' },
            { id: 'sn4', left: 'اللسان', right: 'حاسّة الذوق' },
          ],
        },
        {
          id: `sci-4-${kind}-2`,
          type: 'boolean',
          prompt: 'تساعد العضلات والمفاصل الهيكل العظمي على الحركة بفضل تقلّصها وارتخائها.',
          hint: 'تأمّلي حركة الذراع عند ثنيها وبسطها.',
          explanation: 'صحيح! ترتبط العضلات بالعظام وتحرّك المفاصل بالتقلّص والارتخاء.',
          points: 10,
          correctBoolean: true,
        },
      ];
    case 5:
      return [
        {
          id: `sci-5-${kind}-1`,
          type: 'order',
          prompt: 'رتّبي مراحل تكوّن الثمرة في النبات الزهري:',
          hint: 'تبدأ بالبرعم الزهري وتنتهي بالثمرة.',
          explanation: 'برعم زهري ← زهرة متفتّحة ← تلقيح ← ثمرة تحتوي بذوراً.',
          points: 20,
          correctOrder: ['برعم زهري', 'زهرة متفتّحة', 'عملية التلقيح', 'ثمرة وبذور'],
        },
      ];
    case 6:
      return [
        {
          id: `sci-6-${kind}-1`,
          type: 'choice',
          prompt: 'ماذا تحتاج البذرة السليمة لتنبت وتعطي نبتة صغيرة؟',
          hint: 'لا تحتاج البذرة تحت التربة إلى الضوء في البداية بل إلى الماء والدفء والهواء.',
          explanation: 'تحتاج البذرة للإنبات إلى الماء والحرارة المناسبة والتهوية.',
          points: pts,
          options: [
            'الماء والحرارة المناسبة والهواء',
            'التربة الجافة والبرد القارس',
            'الملح فقط',
            'الزيت والظلام',
          ],
          correctIndex: 0,
        },
      ];
    case 7:
      return [
        {
          id: `sci-7-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي الحيوانات التالية إلى «بيوضة» و«ولودة»:',
          hint: 'الولودة تلد صغاراً وترضعهم حليباً.',
          explanation: 'الأرنب والبقرة ولودتان؛ الحمامة والسلحفاة بيوضتان.',
          points: 20,
          buckets: ['حيوانات ولودة', 'حيوانات بيوضة'],
          classifyItems: [
            { id: 'an1', label: 'الأرنب', bucketIndex: 0 },
            { id: 'an2', label: 'الحمامة', bucketIndex: 1 },
            { id: 'an3', label: 'البقرة', bucketIndex: 0 },
            { id: 'an4', label: 'السلحفاة', bucketIndex: 1 },
          ],
        },
      ];
    case 8:
      return [
        {
          id: `sci-8-${kind}-1`,
          type: 'order',
          prompt: 'رتّبي عناصر السلسلة الغذائية من المنتج إلى المستهلك الأخير:',
          hint: 'ابدئي بالعشب الأخضر.',
          explanation: 'عشب أخضر ← جرادة ← عصفور ← صقر.',
          points: 20,
          correctOrder: ['عشب أخضر', 'جرادة', 'عصفور', 'صقر'],
        },
      ];
    case 9:
      return [
        {
          id: `sci-9-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي التصرفات التالية إلى «صديق للبيئة التونسية» أو «مضرّ بالبيئة»:',
          hint: 'الغرس والاقتصاد في الماء يحميان الطبيعة.',
          explanation: 'غرس الأشجار وترشيد الماء سلوكان صديقان للبيئة.',
          points: 20,
          buckets: ['سلوك صديق للبيئة', 'سلوك مضرّ بالبيئة'],
          classifyItems: [
            { id: 'ev1', label: 'غرس أشجار الزيتون', bucketIndex: 0 },
            { id: 'ev2', label: 'رمي البلاستيك في البحر', bucketIndex: 1 },
            { id: 'ev3', label: 'إغلاق الحنفية بعد الاستعمال', bucketIndex: 0 },
            { id: 'ev4', label: 'إشعال النار في الغابة', bucketIndex: 1 },
          ],
        },
      ];
    case 10:
      return [
        {
          id: `sci-10-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل تحوّل في حالات المادة باسمه العلمي:',
          hint: 'من صلب إلى سائل = انصهار، ومن سائل إلى بخار = تبخّر.',
          explanation: 'انصهار الجليد، تبخّر الماء، وتجمّد الماء.',
          points: 20,
          pairs: [
            { id: 'st1', left: 'من جليد صلب إلى ماء سائل', right: 'الانصهار' },
            { id: 'st2', left: 'من ماء سائل إلى بخار غازي', right: 'التبخّر' },
            { id: 'st3', left: 'من ماء سائل إلى جليد صلب', right: 'التجمّد' },
          ],
        },
      ];
    case 11:
      return [
        {
          id: `sci-11-${kind}-1`,
          type: 'choice',
          prompt: 'كيف نفصل الرمل غير الذائب عن الماء في خليط من الماء والرمل؟',
          hint: 'نستعمل ورقاً خاصاً أو مصفاة دقيقة.',
          explanation: 'نفصل الرمل عن الماء بعملية الترشيح.',
          points: pts,
          options: ['الترشيح', 'التجميد', 'المغناطيس', 'التسخين فقط'],
          correctIndex: 0,
        },
      ];
    case 12:
      return [
        {
          id: `sci-12-${kind}-1`,
          type: 'fill_blank',
          prompt: 'أكملي الجملة العلمية:',
          sentenceBefore: 'نقيس كتلة الخضر والفواكه باستعمال ',
          sentenceAfter: ' وتُقاس بالغرام والكيلوغرام.',
          hint: 'أداة لها كفّتان أو شاشة رقمية.',
          explanation: 'نقيس الكتل باستعمال الميزان.',
          points: pts,
          wordBank: ['الميزان', 'المسطرة', 'المحرار', 'الساعة'],
          correctAnswers: ['الميزان'],
        },
      ];
    case 13:
      return [
        {
          id: `sci-13-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي الأوساط إلى «وسط شفاف» أو «وسط معتم» (مقابل الوسط الشافّ نصف الشفاف):',
          hint: 'الوسط الشفاف يسمح بمرور الضوء فنرى الأجسام بوضوح عبره، أما الشافّ كالورق المزيت فيمرّر جزءاً من الضوء.',
          explanation: 'الزجاج الصافي والماء النقي شفافان، بينما الخشب والحجر معتماً.',
          points: 20,
          buckets: ['وسط شفاف', 'وسط معتم'],
          classifyItems: [
            { id: 'lt1', label: 'لوح زجاجي صافٍ', bucketIndex: 0 },
            { id: 'lt2', label: 'باب خشبي', bucketIndex: 1 },
            { id: 'lt3', label: 'ماء نقي', bucketIndex: 0 },
            { id: 'lt4', label: 'جدار حجري', bucketIndex: 1 },
          ],
        },
      ];
    default:
      return [
        {
          id: `sci-14-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي المواد التالية إلى «موصّلة للكهرباء» أو «عازلة للكهرباء»:',
          hint: 'المعادن موصلة، والبلاستيك والخشب عازلان.',
          explanation: 'النحاس والحديد موصلان للكهرباء، والخشب والبلاستيك عازلان.',
          points: 20,
          buckets: ['مادة موصّلة', 'مادة عازلة'],
          classifyItems: [
            { id: 'el1', label: 'سلك نحاسي', bucketIndex: 0 },
            { id: 'el2', label: 'مسطرة بلاستيكية', bucketIndex: 1 },
            { id: 'el3', label: 'مفتاح حديدي', bucketIndex: 0 },
            { id: 'el4', label: 'خشب جاف', bucketIndex: 1 },
          ],
        },
        {
          id: `sci-14-${kind}-2`,
          type: 'boolean',
          prompt: 'الطاقة الشمسية وطاقة الرياح من الطاقات المتجددة النظيفة في تونس.',
          hint: 'هل تنفد أشعة الشمس أو الرياح؟',
          explanation: 'صحيح! هي طاقات متجددة وصديقة للبيئة.',
          points: 10,
          correctBoolean: true,
        },
      ];
  }
}

function makeTanchiaExercises(topicIndex: number, kind: UnitKind): Exercise[] {
  const pts = kind === 'exam' ? 20 : 15;
  switch (topicIndex) {
    case 0:
      return [
        {
          id: `tn-0-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل حقّ من حقوق الطفل بمثاله:',
          hint: 'تذكّري حقوقك في المدرسة والمستشفى والبيت.',
          explanation: 'التعليم في المدرسة، العلاج في المستشفى، والهوية بالاسم والجنسية.',
          points: 20,
          pairs: [
            { id: 'hr1', left: 'الحق في التعليم', right: 'الالتحاق بالمدرسة الابتدائية' },
            { id: 'hr2', left: 'الحق في الصحة', right: 'تلقي التلاقيح والعلاج' },
            { id: 'hr3', left: 'الحق في الهوية', right: 'الاسم والجنسية التونسية' },
          ],
        },
      ];
    case 1:
      return [
        {
          id: `tn-1-${kind}-1`,
          type: 'classify',
          prompt: 'اسحبي كل بطاقة وصنّفيها إلى «حق للطفل» أو «واجب للتلميذة»:',
          hint: 'الحق ما نتمتّع به، والواجب ما نلتزم بأدائه.',
          explanation: 'التعليم والعلاج حقوق، ونظافة القسم واحترام المعلمة واجبات.',
          points: 20,
          buckets: ['حق للطفل', 'واجب للتلميذة'],
          classifyItems: [
            { id: 'tnc1', label: 'التعليم والترفيه', bucketIndex: 0 },
            { id: 'tnc2', label: 'الحفاظ على نظافة القسم', bucketIndex: 1 },
            { id: 'tnc3', label: 'الحماية والرعاية الصحية', bucketIndex: 0 },
            { id: 'tnc4', label: 'احترام المعلّمين والزميلات', bucketIndex: 1 },
          ],
        },
      ];
    case 2:
      return [
        {
          id: `tn-2-${kind}-1`,
          type: 'boolean',
          prompt: 'الكتابة على طاولات القسم أو إتلاف أزهار الحديقة يضرّ بالممتلكات العامة.',
          hint: 'المدرسة ملك لجميع التلميذات.',
          explanation: 'صحيح! المحافظة على المدرسة نظيفة وجميلة واجب وطني.',
          points: 10,
          correctBoolean: true,
        },
      ];
    case 3:
      return [
        {
          id: `tn-3-${kind}-1`,
          type: 'order',
          prompt: 'رتّبي خطوات عبور الطريق بأمان:',
          hint: 'نقف أولاً عند الرصيف.',
          explanation: 'التوقف على الرصيف ← التأكد من الضوء الأخضر للمترجلين ← النظر يميناً ويساراً ← العبور من ممرّ المترجّلين.',
          points: 20,
          correctOrder: [
            'التوقّف عند حافّة الرصيف',
            'انتظار الضوء الأخضر للمترجّلين',
            'النظر يميناً ويساراً',
            'العبور بهدوء من ممرّ المترجّلين',
          ],
        },
      ];
    case 4:
      return [
        {
          id: `tn-4-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل مؤسسة عمومية تونسية بالخدمة التي تقدّمها:',
          hint: 'فكّري في دور البلدية والبريد والمدرسة.',
          explanation: 'البلدية تستخرج مضمون الولادة وتنظّف الحي، والبريد يوزّع الرسائل.',
          points: 20,
          pairs: [
            { id: 'in1', left: 'البلدية', right: 'استخراج مضمون الولادة ونظافة المدينة' },
            { id: 'in2', left: 'البريد التونسي', right: 'إرسال الرسائل والطرود والادّخار' },
            { id: 'in3', left: 'المستوصف', right: 'تقديم العلاج والتلاقيح' },
          ],
        },
      ];
    case 5:
      return [
        {
          id: `tn-5-${kind}-1`,
          type: 'fill_blank',
          prompt: 'أكملي الجملة التاريخية:',
          sentenceBefore: 'بعد الحضارة القبصية في قفصة، أسّست الأميرة الفينيقية ',
          sentenceAfter: ' مدينة قرطاج سنة 814 ق.م.',
          hint: 'تُلقّب أيضاً بديدون.',
          explanation: 'أسّست عليسة مدينة قرطاج العريقة بعد عصور ما قبل التاريخ والحضارة القبصية.',
          points: pts,
          wordBank: ['عليسة', 'الكاهنة', 'أروى', 'عزيزة'],
          correctAnswers: ['عليسة'],
        },
      ];
    case 6:
      return [
        {
          id: `tn-6-${kind}-1`,
          type: 'choice',
          prompt: 'من هو القائد القرطاجي الشهير الذي عبر جبال الألب بالفيلة؟',
          hint: 'أحد أعظم قادة قرطاج في التاريخ.',
          explanation: 'حنبعل برقة هو القائد القرطاجي الشهير.',
          points: pts,
          options: ['حنبعل برقة', 'عقبة بن نافع', 'يوغرطة', 'ابن خلدون'],
          correctIndex: 0,
        },
      ];
    case 7:
      return [
        {
          id: `tn-7-${kind}-1`,
          type: 'choice',
          prompt: 'في أيّ مدينة تونسية أسّس عقبة بن نافع أوّل جامع في المغرب العربي سنة 50 هـ؟',
          hint: 'مدينة الأغالبة والزربية.',
          explanation: 'أسّس عقبة بن نافع مدينة القيروان وجامعها الشهير.',
          points: pts,
          options: ['سوسة', 'القيروان', 'قابس', 'بنزرت'],
          correctIndex: 1,
        },
      ];
    case 8:
      return [
        {
          id: `tn-8-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل معلم أثري تونسي بولايته:',
          hint: 'الجمّ في الساحل، ودقّة في الشمال الغربي.',
          explanation: 'مسرح الجمّ بالمهدية، دقّة بباجة، سبيطلة بالقصرين.',
          points: 20,
          pairs: [
            { id: 'mn1', left: 'المسرح الروماني بالجمّ', right: 'ولاية المهدية' },
            { id: 'mn2', left: 'موقع دقّة الأثري', right: 'ولاية باجة' },
            { id: 'mn3', left: 'معالم سبيطلة', right: 'ولاية القصرين' },
          ],
        },
      ];
    case 9:
      return [
        {
          id: `tn-9-${kind}-1`,
          type: 'input',
          prompt: 'كم عدد الولايات في الجمهورية التونسية؟',
          hint: 'أكثر من 20 وأقل من 25.',
          explanation: 'تتكون تونس من 24 ولاية.',
          points: pts,
          correctAnswers: ['24'],
          inputPlaceholder: 'العدد',
          quickKeys: ['2', '4', '0', '6'],
        },
      ];
    case 10:
      return [
        {
          id: `tn-10-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل معلم جغرافي تونسي بوصفه:',
          hint: 'أعلى جبل في القصرين وأطول نهر في الشمال.',
          explanation: 'الشعانبي أعلى قمة، مجردة أطول نهر، وشط الجريد أكبر سبخة.',
          points: 20,
          pairs: [
            { id: 'geo1', left: 'جبل الشعانبي', right: 'أعلى قمّة في تونس (1544 م)' },
            { id: 'geo2', left: 'واد مجرّدة', right: 'أطول نهر دائم الجريان في تونس' },
            { id: 'geo3', left: 'شطّ الجريد', right: 'أكبر شطّ ملحي في الجنوب التونسي' },
          ],
        },
      ];
    case 11:
      return [
        {
          id: `tn-11-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل ولاية تونسية بالمنتج أو الصناعة التقليدية التي تشتهر بها:',
          hint: 'نابل للخزف، توزر للتمور، صفاقس للزيتون.',
          explanation: 'نابل: الخزف، توزر: التمور، صفاقس: زيت الزيتون.',
          points: 20,
          pairs: [
            { id: 'ec1', left: 'ولاية نابل', right: 'صناعة الخزف والفخار' },
            { id: 'ec2', left: 'ولاية توزر', right: 'واحات النخيل والتمور' },
            { id: 'ec3', left: 'ولاية صفاقس', right: 'غابات الزيتون وزيت الزيتون' },
          ],
        },
      ];
    case 12:
      return [
        {
          id: `tn-12-${kind}-1`,
          type: 'input',
          prompt: 'كم عدد أركان الإيمان؟ (اكتبي الرقم)',
          hint: 'بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر.',
          explanation: 'أركان الإيمان 6 أركان.',
          points: pts,
          correctAnswers: ['6'],
          inputPlaceholder: 'العدد',
          quickKeys: ['4', '5', '6', '7'],
        },
      ];
    case 13:
      return [
        {
          id: `tn-13-${kind}-1`,
          type: 'fill_blank',
          prompt: 'أكملي الآية الكريمة من سورة الانفطار المقرّرة للسنة الخامسة:',
          sentenceBefore: 'يا أيّها الإنسان ما غرّك بربّك ',
          sentenceAfter: '.',
          hint: 'الآية السادسة من سورة الانفطار.',
          explanation: 'قال تعالى: «يا أيّها الإنسان ما غرّك بربّك الكريم».',
          points: pts,
          wordBank: ['الكريم', 'العظيم', 'الحكيم', 'الرحيم'],
          correctAnswers: ['الكريم'],
        },
        {
          id: `tn-13-${kind}-2`,
          type: 'choice',
          prompt: 'بأيّ رواية قرآنية تُقرأ وتُحفظ السور المقرّرة (الانفطار، المطفّفين، الانشقاق، البروج) في المدارس التونسية؟',
          hint: 'الرواية المعتمدة رسمياً في تونس.',
          explanation: 'تُعتمد رواية قالون عن نافع في الكتب المدرسية التونسية.',
          points: pts,
          options: ['رواية قالون عن نافع', 'رواية البصري', 'رواية الكوفي', 'رواية الشامي'],
          correctIndex: 0,
        },
      ];
    default:
      return [
        {
          id: `tn-14-${kind}-1`,
          type: 'choice',
          prompt: 'ما اللقب الذي عُرف به النبي محمد ﷺ قبل البعثة لصدقه وأمانته؟',
          hint: 'يجمع بين الصدق والأمانة.',
          explanation: 'لُقّب النبي ﷺ بالصادق الأمين.',
          points: pts,
          options: ['الصادق الأمين', 'ذو النورين', 'سيف الله', 'الفاروق'],
          correctIndex: 0,
        },
      ];
  }
}

function makeFrenchExercises(topicIndex: number, kind: UnitKind): Exercise[] {
  const pts = kind === 'exam' ? 20 : 15;
  switch (topicIndex) {
    case 0:
      return [
        {
          id: `fr-0-${kind}-1`,
          type: 'match',
          lang: 'fr',
          prompt: 'Associe chaque phrase à son type :',
          hint: 'Regarde la ponctuation finale (.), (?) ou (!).',
          explanation: 'Point (.) = déclarative, (?) = interrogative, (!) = exclamative.',
          points: 20,
          pairs: [
            { id: 'fr0p1', left: 'Cyrine aime la lecture.', right: 'Déclarative' },
            { id: 'fr0p2', left: 'Où est ton cahier ?', right: 'Interrogative' },
            { id: 'fr0p3', left: 'Quelle belle fleur !', right: 'Exclamative' },
          ],
        },
      ];
    case 1:
      return [
        {
          id: `fr-1-${kind}-1`,
          type: 'fill_blank',
          lang: 'fr',
          prompt: 'Mets la phrase à la forme négative :',
          sentenceBefore: 'Cyrine ',
          sentenceAfter: ' regarde pas la télévision tard.',
          hint: 'On place "ne" devant le verbe.',
          explanation: 'La négation s’écrit : "ne ... pas".',
          points: pts,
          wordBank: ['ne', 'est', 'et', 'a'],
          correctAnswers: ['ne'],
        },
      ];
    case 2:
      return [
        {
          id: `fr-2-${kind}-1`,
          type: 'fill_blank',
          lang: 'fr',
          prompt: 'Choisis le bon déterminant :',
          sentenceBefore: 'Cyrine range ',
          sentenceAfter: ' cahiers dans son cartable.',
          hint: '"cahiers" est au pluriel.',
          explanation: 'Devant un nom pluriel, on utilise "ses".',
          points: pts,
          wordBank: ['ses', 'son', 'sa', 'un'],
          correctAnswers: ['ses'],
        },
      ];
    case 3:
      return [
        {
          id: `fr-3-${kind}-1`,
          type: 'classify',
          lang: 'fr',
          prompt: 'Classe les adjectifs au masculin ou au féminin :',
          hint: 'Les adjectifs féminins se terminent souvent par -e ou -euse.',
          explanation: '"jolie" et "heureuse" sont féminins ; "grand" et "petit" sont masculins.',
          points: 20,
          buckets: ['Masculin', 'Féminin'],
          classifyItems: [
            { id: 'fa1', label: 'grand', bucketIndex: 0 },
            { id: 'fa2', label: 'jolie', bucketIndex: 1 },
            { id: 'fa3', label: 'petit', bucketIndex: 0 },
            { id: 'fa4', label: 'heureuse', bucketIndex: 1 },
          ],
        },
      ];
    case 4:
      return [
        {
          id: `fr-4-${kind}-1`,
          type: 'order',
          lang: 'fr',
          prompt: 'Glisse les mots dans l’ordre pour former une phrase correcte :',
          hint: 'Commence par le sujet "Cyrine".',
          explanation: '"Cyrine lit un livre intéressant."',
          points: 20,
          correctOrder: ['Cyrine', 'lit', 'un livre', 'intéressant.'],
        },
      ];
    case 5:
      return [
        {
          id: `fr-5-${kind}-1`,
          type: 'choice',
          lang: 'fr',
          prompt: 'Complète au présent : "Les élèves ...... attentives en classe." (être)',
          hint: '"Les élèves" = "Elles".',
          explanation: 'Elles sont attentives.',
          points: pts,
          options: ['est', 'sommes', 'sont', 'ont'],
          correctIndex: 2,
        },
      ];
    case 6:
      return [
        {
          id: `fr-6-${kind}-1`,
          type: 'classify',
          lang: 'fr',
          prompt: 'Classe ces verbes selon leur groupe :',
          hint: 'Le 1er groupe finit par -er ; le 2e groupe finit par -ir (nous -issons).',
          explanation: 'Chanter et jouer = 1er groupe ; finir et choisir = 2e groupe.',
          points: 20,
          buckets: ['1er groupe (-er)', '2e groupe (-ir)'],
          classifyItems: [
            { id: 'fg1', label: 'chanter', bucketIndex: 0 },
            { id: 'fg2', label: 'finir', bucketIndex: 1 },
            { id: 'fg3', label: 'jouer', bucketIndex: 0 },
            { id: 'fg4', label: 'choisir', bucketIndex: 1 },
          ],
        },
      ];
    case 7:
      return [
        {
          id: `fr-7-${kind}-1`,
          type: 'choice',
          lang: 'fr',
          prompt: 'Conjugue au présent : "Nous ...... nos devoirs." (finir)',
          hint: 'Avec "nous", le 2e groupe prend -issons.',
          explanation: 'Nous finissons.',
          points: pts,
          options: ['finisons', 'finissons', 'finis', 'finissent'],
          correctIndex: 1,
        },
      ];
    case 8:
      return [
        {
          id: `fr-8-${kind}-1`,
          type: 'match',
          lang: 'fr',
          prompt: 'Associe chaque verbe à sa forme au passé composé avec "elle" :',
          hint: 'Regarde le participe passé de chaque verbe.',
          explanation: 'Elle a mangé, elle a fini, elle est allée.',
          points: 20,
          pairs: [
            { id: 'pc1', left: 'manger', right: 'elle a mangé' },
            { id: 'pc2', left: 'finir', right: 'elle a fini' },
            { id: 'pc3', left: 'aller', right: 'elle est allée' },
          ],
        },
      ];
    case 9:
      return [
        {
          id: `fr-9-${kind}-1`,
          type: 'input',
          lang: 'fr',
          prompt: 'Conjugue "chanter" au futur simple : Demain, tu ......',
          hint: 'Infinitif "chanter" + "-as".',
          explanation: 'Tu chanteras.',
          points: pts,
          correctAnswers: ['chanteras'],
          inputPlaceholder: 'Écris le verbe conjugué',
        },
      ];
    case 10:
      return [
        {
          id: `fr-10-${kind}-1`,
          type: 'fill_blank',
          lang: 'fr',
          prompt: 'Complète avec le bon homophone :',
          sentenceBefore: 'La Tunisie ',
          sentenceAfter: ' un beau pays méditerranéen.',
          hint: 'On peut dire "était".',
          explanation: 'On écrit le verbe être "est".',
          points: pts,
          wordBank: ['est', 'et', 'à', 'a'],
          correctAnswers: ['est'],
        },
      ];
    case 11:
      return [
        {
          id: `fr-11-${kind}-1`,
          type: 'choice',
          lang: 'fr',
          prompt: 'Complète : "Les filles ...... rangé leurs cahiers dans ...... cartable."',
          hint: '"ont" = avaient ; "leur" sans s devant un nom singulier.',
          explanation: 'Les filles ont rangé leurs cahiers.',
          points: pts,
          options: ['on / son', 'ont / leur', 'ont / leurs', 'on / leur'],
          correctIndex: 1,
        },
      ];
    case 12:
      return [
        {
          id: `fr-12-${kind}-1`,
          type: 'match',
          lang: 'fr',
          prompt: 'Associe chaque nom singulier à son pluriel :',
          hint: 'Les mots en -al font souvent -aux.',
          explanation: 'un journal → des journaux, un bijou → des bijoux, une fleur → des fleurs.',
          points: 20,
          pairs: [
            { id: 'pl1', left: 'un journal', right: 'des journaux' },
            { id: 'pl2', left: 'un bijou', right: 'des bijoux' },
            { id: 'pl3', left: 'une fleur', right: 'des fleurs' },
          ],
        },
      ];
    case 13:
      return [
        {
          id: `fr-13-${kind}-1`,
          type: 'match',
          lang: 'fr',
          prompt: 'Associe chaque mot à son antonyme (contraire) :',
          hint: 'Cherche le sens opposé.',
          explanation: 'grand / petit, joyeux / triste, rapide / lent.',
          points: 20,
          pairs: [
            { id: 'ant1', left: 'grand', right: 'petit' },
            { id: 'ant2', left: 'joyeux', right: 'triste' },
            { id: 'ant3', left: 'rapide', right: 'lent' },
          ],
        },
      ];
    default:
      return [
        {
          id: `fr-14-${kind}-1`,
          type: 'order',
          lang: 'fr',
          prompt: 'Remets en ordre le petit texte de Cyrine :',
          hint: 'Commence par le moment de la journée.',
          explanation: 'Ce matin, Cyrine cueille du jasmin blanc puis elle va à l’école avec le sourire.',
          points: 20,
          correctOrder: [
            'Ce matin,',
            'Cyrine cueille du jasmin blanc,',
            'puis elle part à l’école',
            'avec un grand sourire.',
          ],
        },
      ];
  }
}

function makeEnglishExercises(topicIndex: number, kind: UnitKind): Exercise[] {
  const pts = kind === 'exam' ? 20 : 15;
  switch (topicIndex) {
    case 0:
      return [
        {
          id: `en-0-${kind}-1`,
          type: 'order',
          lang: 'en',
          prompt: 'Drag the words in order to introduce yourself:',
          hint: 'Start with "Hello,".',
          explanation: '"Hello, my name is Cyrine."',
          points: 20,
          correctOrder: ['Hello,', 'my name', 'is', 'Cyrine.'],
        },
      ];
    case 1:
      return [
        {
          id: `en-1-${kind}-1`,
          type: 'match',
          lang: 'en',
          prompt: 'Match each family member with its Arabic meaning:',
          hint: 'Think of family members.',
          explanation: 'Mother = الأم، Father = الأب، Sister = الأخت.',
          points: 20,
          pairs: [
            { id: 'enm1', left: 'Mother', right: 'الأم' },
            { id: 'enm2', left: 'Father', right: 'الأب' },
            { id: 'enm3', left: 'Sister', right: 'الأخت' },
          ],
        },
      ];
    case 2:
      return [
        {
          id: `en-2-${kind}-1`,
          type: 'match',
          lang: 'en',
          prompt: 'Match each school object with its meaning:',
          hint: 'Items inside your backpack.',
          explanation: 'Notebook = كرّاس، Pencil case = مقلمة، Ruler = مسطرة.',
          points: 20,
          pairs: [
            { id: 'ens1', left: 'Notebook', right: 'كرّاس' },
            { id: 'ens2', left: 'Pencil case', right: 'مقلمة' },
            { id: 'ens3', left: 'Ruler', right: 'مسطرة' },
          ],
        },
      ];
    case 3:
      return [
        {
          id: `en-3-${kind}-1`,
          type: 'order',
          lang: 'en',
          prompt: 'Order these days of the week starting from Monday:',
          hint: 'Monday → Tuesday → Wednesday → Thursday.',
          explanation: 'Monday, Tuesday, Wednesday, Thursday.',
          points: 20,
          correctOrder: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        },
      ];
    case 4:
      return [
        {
          id: `en-4-${kind}-1`,
          type: 'fill_blank',
          lang: 'en',
          prompt: 'Complete the classroom instruction:',
          sentenceBefore: 'Please, ',
          sentenceAfter: ' your notebook and write the date.',
          hint: 'What do you do with your notebook before writing?',
          explanation: 'Open your notebook.',
          points: pts,
          wordBank: ['open', 'eat', 'sleep', 'run'],
          correctAnswers: ['open'],
        },
      ];
    case 5:
      return [
        {
          id: `en-5-${kind}-1`,
          type: 'fill_blank',
          lang: 'en',
          prompt: 'Complete with "have got" or "has got":',
          sentenceBefore: 'Cyrine ',
          sentenceAfter: ' a pink backpack.',
          hint: 'Cyrine = She.',
          explanation: 'With he/she/it we use "has got".',
          points: pts,
          wordBank: ['has got', 'have got', 'are', 'am'],
          correctAnswers: ['has got'],
        },
      ];
    case 6:
      return [
        {
          id: `en-6-${kind}-1`,
          type: 'input',
          lang: 'en',
          prompt: 'Complete: "Every morning, Cyrine ...... (go) to school at 8 o’clock."',
          hint: 'With "she", "go" takes -es.',
          explanation: 'Cyrine goes to school.',
          points: pts,
          correctAnswers: ['goes'],
          inputPlaceholder: 'Type the verb (goes)',
        },
      ];
    case 7:
      return [
        {
          id: `en-7-${kind}-1`,
          type: 'choice',
          lang: 'en',
          prompt: 'Look! Cyrine ...... a picture of Sidi Bou Said right now.',
          hint: '"Right now" means Present Continuous.',
          explanation: 'She is drawing.',
          points: pts,
          options: ['draw', 'draws', 'is drawing', 'are drawing'],
          correctIndex: 2,
        },
      ];
    case 8:
      return [
        {
          id: `en-8-${kind}-1`,
          type: 'match',
          lang: 'en',
          prompt: 'Match each English preposition with its Arabic meaning:',
          hint: 'Where is the book?',
          explanation: 'In = في/داخل، On = على، Under = تحت.',
          points: 20,
          pairs: [
            { id: 'pr1', left: 'in', right: 'داخل / في' },
            { id: 'pr2', left: 'on', right: 'فوق / على' },
            { id: 'pr3', left: 'under', right: 'تحت' },
          ],
        },
      ];
    case 9:
      return [
        {
          id: `en-9-${kind}-1`,
          type: 'match',
          lang: 'en',
          prompt: 'Match each clock time with its English phrase:',
          hint: 'Half past = والنصف.',
          explanation: '08:00 = eight o’clock, 08:30 = half past eight.',
          points: 20,
          pairs: [
            { id: 'tm1', left: '08:00', right: 'It is eight o’clock' },
            { id: 'tm2', left: '08:30', right: 'It is half past eight' },
            { id: 'tm3', left: '10:00', right: 'It is ten o’clock' },
          ],
        },
      ];
    case 10:
      return [
        {
          id: `en-10-${kind}-1`,
          type: 'classify',
          lang: 'en',
          prompt: 'Drag each word to Seasons or Weather:',
          hint: 'Spring/Winter are seasons; Sunny/Rainy describe weather.',
          explanation: 'Spring & Winter = Seasons; Sunny & Rainy = Weather.',
          points: 20,
          buckets: ['Seasons (الفصول)', 'Weather (الطقس)'],
          classifyItems: [
            { id: 'sw1', label: 'Spring', bucketIndex: 0 },
            { id: 'sw2', label: 'Sunny', bucketIndex: 1 },
            { id: 'sw3', label: 'Winter', bucketIndex: 0 },
            { id: 'sw4', label: 'Rainy', bucketIndex: 1 },
          ],
        },
      ];
    case 11:
      return [
        {
          id: `en-11-${kind}-1`,
          type: 'classify',
          lang: 'en',
          prompt: 'Classify clothes for Summer or Winter:',
          hint: 'What do we wear when it is hot vs cold?',
          explanation: 'T-shirt & sunglasses for Summer; Coat & scarf for Winter.',
          points: 20,
          buckets: ['Summer Clothes', 'Winter Clothes'],
          classifyItems: [
            { id: 'cl1', label: 'T-shirt', bucketIndex: 0 },
            { id: 'cl2', label: 'Wool Coat', bucketIndex: 1 },
            { id: 'cl3', label: 'Sunglasses', bucketIndex: 0 },
            { id: 'cl4', label: 'Warm Scarf', bucketIndex: 1 },
          ],
        },
      ];
    case 12:
      return [
        {
          id: `en-12-${kind}-1`,
          type: 'classify',
          prompt: 'Classify healthy foods into Fruits or Drinks:',
          lang: 'en',
          hint: 'Oranges and apples are fruits; water and milk are drinks.',
          explanation: 'Apples & Oranges are fruits; Water & Milk are drinks.',
          points: 20,
          buckets: ['Fruits', 'Drinks'],
          classifyItems: [
            { id: 'fd1', label: 'Apples', bucketIndex: 0 },
            { id: 'fd2', label: 'Water', bucketIndex: 1 },
            { id: 'fd3', label: 'Oranges', bucketIndex: 0 },
            { id: 'fd4', label: 'Milk', bucketIndex: 1 },
          ],
        },
      ];
    case 13:
      return [
        {
          id: `en-13-${kind}-1`,
          type: 'fill_blank',
          lang: 'en',
          prompt: 'Complete the sentence about Cyrine’s hobby:',
          sentenceBefore: 'Cyrine likes ',
          sentenceAfter: ' storybooks in her free time.',
          hint: 'After "likes" we use verb + -ing.',
          explanation: 'Cyrine likes reading storybooks.',
          points: pts,
          wordBank: ['reading', 'read', 'reads', 'to'],
          correctAnswers: ['reading'],
        },
      ];
    default:
      return [
        {
          id: `en-14-${kind}-1`,
          type: 'order',
          lang: 'en',
          prompt: 'Order the short dialogue between Cyrine and Lina:',
          hint: 'Start with the greeting.',
          explanation: 'Hello Lina! → How are you? → I am fine, thank you!',
          points: 20,
          correctOrder: [
            'Hello Lina!',
            'How are you today?',
            'I am fine, thank you!',
          ],
        },
      ];
  }
}

function makeArtsTechExercises(topicIndex: number, kind: UnitKind): Exercise[] {
  const pts = kind === 'exam' ? 20 : 15;
  switch (topicIndex) {
    case 0:
      return [
        {
          id: `art-0-${kind}-1`,
          type: 'classify',
          prompt: 'اسحبي كل لون إلى «لون أساسي» أو «لون ثانوي»:',
          hint: 'الأحمر والأصفر والأزرق ألوان أساسية.',
          explanation: 'الأحمر والأزرق أساسيان؛ البنفسجي والأخضر ثانويان.',
          points: 20,
          buckets: ['لون أساسي', 'لون ثانوي'],
          classifyItems: [
            { id: 'ac1', label: 'الأحمر', bucketIndex: 0 },
            { id: 'ac2', label: 'البنفسجي', bucketIndex: 1 },
            { id: 'ac3', label: 'الأزرق', bucketIndex: 0 },
            { id: 'ac4', label: 'الأخضر', bucketIndex: 1 },
          ],
        },
      ];
    case 1:
      return [
        {
          id: `art-1-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي الألوان إلى «ألوان دافئة» أو «ألوان باردة»:',
          hint: 'الألوان الدافئة تشبه الشمس والنار.',
          explanation: 'الأحمر والبرتقالي دافئان؛ الأزرق والأخضر باردان.',
          points: 20,
          buckets: ['ألوان دافئة', 'ألوان باردة'],
          classifyItems: [
            { id: 'wc1', label: 'الأحمر', bucketIndex: 0 },
            { id: 'wc2', label: 'الأزرق', bucketIndex: 1 },
            { id: 'wc3', label: 'البرتقالي', bucketIndex: 0 },
            { id: 'wc4', label: 'الأخضر', bucketIndex: 1 },
          ],
        },
      ];
    case 2:
    case 3:
    case 4:
      return [
        {
          id: `art-2-${topicIndex}-${kind}-1`,
          type: 'boolean',
          prompt: 'يعتمد الزليج والفسيفساء التونسية على التناظر وتكرار الأشكال الهندسية الجميلة.',
          hint: 'تأمّلي لوحات متحف باردو والزخرفة التونسية.',
          explanation: 'صحيح! التناظر والتكرار يمنحان الزليج والفسيفساء جمالاً متوازناً.',
          points: 10,
          correctBoolean: true,
        },
        {
          id: `art-2-${topicIndex}-${kind}-2`,
          type: 'choice',
          prompt: 'من أين تتكوّن لوحات الفسيفساء التونسية القديمة؟',
          hint: 'قطع صغيرة ملوّنة مرصوفة بدقّة.',
          explanation: 'تُصنع من مكعّبات حجرية وزجاجية صغيرة ملوّنة.',
          points: pts,
          options: [
            'مكعّبات صغيرة من الحجر والزجاج',
            'أوراق الشجر الجافة فقط',
            'خيوط الصوف',
            'الأخشاب الكبيرة',
          ],
          correctIndex: 0,
        },
      ];
    case 5:
    case 6:
    case 7:
      return [
        {
          id: `art-5-${topicIndex}-${kind}-1`,
          type: 'choice',
          prompt: 'ما الآلة البسيطة التي نستعملها لرفع دلو الماء من البئر بسهولة؟',
          hint: 'عجلة يمرّ فوقها حبل.',
          explanation: 'البكرة تسهّل رفع الأجسام الثقيلة.',
          points: pts,
          options: ['المقص', 'البكرة', 'الممحاة', 'المسطرة'],
          correctIndex: 1,
        },
        {
          id: `art-5-${topicIndex}-${kind}-2`,
          type: 'boolean',
          prompt: 'لمس المقابس الكهربائية بأيدٍ مبلّلة بالماء خطير جداً.',
          hint: 'الماء موصل للتيار الكهربائي.',
          explanation: 'صحيح! نجفّف أيدينا تماماً ولا نعبث بالمقابس الكهربائية.',
          points: 10,
          correctBoolean: true,
        },
      ];
    case 8:
    case 9:
      return [
        {
          id: `art-9-${topicIndex}-${kind}-1`,
          type: 'classify',
          prompt: 'صنّفي مكونات الحاسوب إلى «وحدة إدخال» أو «وحدة إخراج»:',
          hint: 'لوحة المفاتيح تُدخل البيانات، والشاشة تعرضها.',
          explanation: 'لوحة المفاتيح والفأرة للإدخال؛ الشاشة والطابعة للإخراج.',
          points: 20,
          buckets: ['وحدة إدخال', 'وحدة إخراج'],
          classifyItems: [
            { id: 'pc1', label: 'لوحة المفاتيح', bucketIndex: 0 },
            { id: 'pc2', label: 'الشاشة', bucketIndex: 1 },
            { id: 'pc3', label: 'الفأرة', bucketIndex: 0 },
            { id: 'pc4', label: 'الطابعة', bucketIndex: 1 },
          ],
        },
      ];
    case 10:
    case 11:
      return [
        {
          id: `art-10-${topicIndex}-${kind}-1`,
          type: 'choice',
          prompt: 'إذا طلب منكِ شخص مجهول كلمة مروركِ عبر الإنترنت، ماذا تفعلين؟',
          hint: 'كلمة المرور سرّية.',
          explanation: 'نرفض ونخبر والدينا أو معلّمتنا فوراً.',
          points: pts,
          options: [
            'أرسلها له فوراً',
            'أرفض وأخبر والديّ فوراً',
            'أكتبها في تعليق عام',
            'أفتح كل الروابط الغريبة',
          ],
          correctIndex: 1,
        },
      ];
    default:
      return [
        {
          id: `art-12-${topicIndex}-${kind}-1`,
          type: 'match',
          prompt: 'طابقي كل آلة موسيقية تونسية بنوعها:',
          hint: 'العود بأوتار، الناي بالنفخ، والدربوكة بالنقر.',
          explanation: 'العود آلة وترية، الناي آلة هوائية، الدربوكة آلة إيقاعية.',
          points: 20,
          pairs: [
            { id: 'ms1', left: 'العود التونسي', right: 'آلة وترية' },
            { id: 'ms2', left: 'الناي', right: 'آلة هوائية' },
            { id: 'ms3', left: 'الدربوكة', right: 'آلة إيقاعية' },
          ],
        },
      ];
  }
}

const SUPPLEMENT_BANK: Record<SubjectId, Exercise[]> = {
  math: [
    {
      id: 'sup-m-1',
      type: 'boolean',
      prompt: 'محيط المربّع الذي طول ضلعه 9 صم يساوي 36 صم.',
      hint: 'محيط المربّع = الضلع × 4.',
      explanation: 'صحيح! 9 × 4 = 36 صم.',
      points: 10,
      correctBoolean: true,
    },
    {
      id: 'sup-m-2',
      type: 'choice',
      prompt: 'كم مليماً في 3 دنانير وربع؟',
      hint: '1 دينار = 1000 مليم، وربع دينار = 250 مليماً.',
      explanation: '3 دنانير وربع = 3250 مليماً.',
      points: 15,
      options: ['3025 مليماً', '3250 مليماً', '3500 مليم', '3150 مليماً'],
      correctIndex: 1,
    },
    {
      id: 'sup-m-3',
      type: 'fill_blank',
      prompt: 'أكملي التحويل التالي:',
      sentenceBefore: 'نصف كيلوغرام يساوي ',
      sentenceAfter: ' غرام.',
      hint: '1 كغ = 1000 غ.',
      explanation: 'نصف 1000 غ هو 500 غ.',
      points: 15,
      wordBank: ['250', '500', '750', '100'],
      correctAnswers: ['500'],
    },
  ],
  arabic: [
    {
      id: 'sup-ar-1',
      type: 'choice',
      prompt: '«كان الجوُّ صحواً.» ما إعراب كلمة «صحواً»؟',
      hint: '«كان» ترفع المبتدأ وتنصب الخبر.',
      explanation: '«صحواً» خبر كان منصوب وعلامة نصبه الفتحة الظاهرة.',
      points: 15,
      options: ['اسم كان مرفوع', 'خبر كان منصوب', 'فاعل مرفوع', 'مفعول مطلق'],
      correctIndex: 1,
    },
    {
      id: 'sup-ar-2',
      type: 'boolean',
      prompt: 'الفعل «وَقَفَ» فعل معتلّ مثال لأن أوله حرف علّة (الواو).',
      hint: 'ما هو الحرف الأول في «وقف»؟',
      explanation: 'صحيح! المعتلّ المثال يبدأ بحرف علّة.',
      points: 10,
      correctBoolean: true,
    },
    {
      id: 'sup-ar-3',
      type: 'fill_blank',
      prompt: 'املئي الفراغ بالكلمة المكتوبة إملائياً بشكل صحيح:',
      sentenceBefore: 'قرأتْ سيرينُ قصّةً ',
      sentenceAfter: ' في مكتبة المدرسة.',
      hint: 'الصفة اسم مفرد مؤنث ينتهي بتاء مربوطة.',
      explanation: '«مشوّقةً» تنتهي بتاء مربوطة.',
      points: 15,
      wordBank: ['مشوّقةً', 'مشوّقتاً', 'مشوّقةٍ', 'مشوّقٌ'],
      correctAnswers: ['مشوّقةً'],
    },
  ],
  science: [
    {
      id: 'sup-sc-1',
      type: 'boolean',
      prompt: 'تبدأ كل سلسلة غذائية بنبات أخضر يُسمّى كائناً مُنتجاً.',
      hint: 'هل يصنع النبات غذاءه بنفسه؟',
      explanation: 'صحيح! يصنع النبات غذاءه بفضل الضوء والماء وثاني أكسيد الكربون.',
      points: 10,
      correctBoolean: true,
    },
    {
      id: 'sup-sc-2',
      type: 'choice',
      prompt: 'أيّ الأعضاء التالية مسؤول عن ضخّ الدم في كامل الجسم؟',
      hint: 'ينبض في القفص الصدري دون توقف.',
      explanation: 'القلب يضخّ الدم عبر الشرايين إلى جميع الخلايا.',
      points: 15,
      options: ['المعدة', 'القلب', 'الرئة', 'المثانة'],
      correctIndex: 1,
    },
    {
      id: 'sup-sc-3',
      type: 'fill_blank',
      prompt: 'أكملي الجملة العلمية:',
      sentenceBefore: 'يتحوّل الماء السائل إلى جليد صلب بعملية ',
      sentenceAfter: '.',
      hint: 'عند وضع الماء في المجمّد.',
      explanation: 'يتحوّل الماء السائل إلى جليد بالتجمّد.',
      points: 15,
      wordBank: ['التجمّد', 'التبخّر', 'الانصهار', 'الترشيح'],
      correctAnswers: ['التجمّد'],
    },
  ],
  tanchia: [
    {
      id: 'sup-tn-1',
      type: 'choice',
      prompt: 'في أيّ مدينة تونسية يوجد جامع عقبة بن نافع؟',
      hint: 'عاصمة الأغالبة في وسط تونس.',
      explanation: 'يوجد جامع عقبة بن نافع في مدينة القيروان.',
      points: 15,
      options: ['سوسة', 'القيروان', 'قابس', 'توزر'],
      correctIndex: 1,
    },
    {
      id: 'sup-tn-2',
      type: 'boolean',
      prompt: 'بَرّ الوالدين وإماطة الأذى عن الطريق من الأخلاق الإسلامية الحميدة.',
      hint: 'قيم التعاون والاحترام.',
      explanation: 'صحيح! أوصانا الإسلام ببرّ الوالدين ونظافة المحيط.',
      points: 10,
      correctBoolean: true,
    },
    {
      id: 'sup-tn-3',
      type: 'fill_blank',
      prompt: 'أكملي الجملة الجغرافية:',
      sentenceBefore: 'تشتهر ولاية ',
      sentenceAfter: ' بكونها واحة بحرية فريدة في الجنوب التونسي.',
      hint: 'تجمع بين النخيل والبحر المتوسط.',
      explanation: 'ولاية قابس تشتهر بواحتها البحرية.',
      points: 15,
      wordBank: ['قابس', 'باجة', 'جندوبة', 'سليانة'],
      correctAnswers: ['قابس'],
    },
  ],
  french: [
    {
      id: 'sup-fr-1',
      type: 'boolean',
      lang: 'fr',
      prompt: 'Dans "La Tunisie est belle", on écrit "est" parce qu’on peut dire "était".',
      hint: 'Essaie à l’imparfait.',
      explanation: 'Vrai ! "est" est le verbe être au présent.',
      points: 10,
      correctBoolean: true,
    },
    {
      id: 'sup-fr-2',
      type: 'choice',
      lang: 'fr',
      prompt: 'Quel est le type de la phrase : "Comme ce jasmin sent bon !"',
      hint: 'Regarde le point d’exclamation (!).',
      explanation: 'C’est une phrase exclamative.',
      points: 15,
      options: ['Déclarative', 'Interrogative', 'Exclamative', 'Négative'],
      correctIndex: 2,
    },
    {
      id: 'sup-fr-3',
      type: 'fill_blank',
      lang: 'fr',
      prompt: 'Complète avec le pronom qui convient :',
      sentenceBefore: 'Demain, ',
      sentenceAfter: ' visiterons le musée du Bardo.',
      hint: 'Le verbe "visiterons" se termine par -ons.',
      explanation: 'Avec "-ons", le pronom sujet est "nous".',
      points: 15,
      wordBank: ['nous', 'je', 'tu', 'elles'],
      correctAnswers: ['nous'],
    },
  ],
  english: [
    {
      id: 'sup-en-1',
      type: 'boolean',
      lang: 'en',
      prompt: 'Saturday and Sunday are the two days of the weekend.',
      hint: 'Think about the seven days of the week.',
      explanation: 'True! Saturday and Sunday form the weekend.',
      points: 10,
      correctBoolean: true,
    },
    {
      id: 'sup-en-2',
      type: 'choice',
      lang: 'en',
      prompt: 'Choose the right word: "Cyrine keeps her pens in her ......"',
      hint: 'Where do you store pens and pencils?',
      explanation: 'Inside her "pencil case".',
      points: 15,
      options: ['kitchen', 'pencil case', 'garden', 'window'],
      correctIndex: 1,
    },
    {
      id: 'sup-en-3',
      type: 'fill_blank',
      lang: 'en',
      prompt: 'Complete the greeting:',
      sentenceBefore: 'Good morning! How ',
      sentenceAfter: ' you today?',
      hint: 'Verb to be with "you".',
      explanation: 'We say: "How are you today?"',
      points: 15,
      wordBank: ['are', 'is', 'am', 'has'],
      correctAnswers: ['are'],
    },
  ],
  arts_tech: [
    {
      id: 'sup-art-1',
      type: 'choice',
      prompt: 'عند مزج اللون الأصفر مع اللون الأزرق، ما اللون الثانوي الناتج؟',
      hint: 'لون أوراق الأشجار في الربيع.',
      explanation: 'الأصفر + الأزرق = الأخضر.',
      points: 15,
      options: ['البنفسجي', 'الأخضر', 'البرتقالي', 'الأسود'],
      correctIndex: 1,
    },
    {
      id: 'sup-art-2',
      type: 'boolean',
      prompt: 'يتكوّن المكعّب من 6 أوجه مربّعة متقايسة.',
      hint: 'عدّي أوجه النرد أو المكعب.',
      explanation: 'صحيح! للمكعّب 6 أوجه مربّعة.',
      points: 10,
      correctBoolean: true,
    },
    {
      id: 'sup-art-3',
      type: 'fill_blank',
      prompt: 'أكملي الجملة الفنية:',
      sentenceBefore: 'يُعدّ فنّ ',
      sentenceAfter: ' التونسي من أشهر الفنون المعتمدة على التناظر الهندسي.',
      hint: 'زخرفة البلاط الملوّن.',
      explanation: 'الزليج التونسي يتميّز بالتناظر والتكرار الهندسي.',
      points: 15,
      wordBank: ['الزليج', 'التصوير الفوتوغرافي', 'الطباعة ثلاثية الأبعاد', 'الميكانيك'],
      correctAnswers: ['الزليج'],
    },
  ],
};

export function generateExercisesForUnit(
  subjectId: SubjectId,
  topicIndex: number,
  kind: UnitKind
): Exercise[] {
  let base: Exercise[];
  switch (subjectId) {
    case 'math':
      base = makeMathExercises(topicIndex, kind);
      break;
    case 'arabic':
      base = makeArabicExercises(topicIndex, kind);
      break;
    case 'science':
      base = makeScienceExercises(topicIndex, kind);
      break;
    case 'tanchia':
      base = makeTanchiaExercises(topicIndex, kind);
      break;
    case 'french':
      base = makeFrenchExercises(topicIndex, kind);
      break;
    case 'english':
      base = makeEnglishExercises(topicIndex, kind);
      break;
    case 'arts_tech':
      base = makeArtsTechExercises(topicIndex, kind);
      break;
  }

  const targetCount = kind === 'exam' ? 4 : 3;
  const supPool = SUPPLEMENT_BANK[subjectId];
  let idx = 0;
  while (base.length < targetCount && idx < supPool.length) {
    const pick = supPool[(topicIndex + idx) % supPool.length];
    base = [
      ...base,
      {
        ...pick,
        id: `${subjectId}-${topicIndex}-${kind}-sup-${idx}`,
      },
    ];
    idx++;
  }
  return base;
}
