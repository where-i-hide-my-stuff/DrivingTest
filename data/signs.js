window.CATEGORIES = window.CATEGORIES || [];
// answer = position of the correct option, starting from 0. image is optional (e.g. 'images/signs/sign-001.png').
window.CATEGORIES.push({ title: { ar: 'إشارات السير', en: 'Traffic signs' }, image: 'images/categories/signs.svg', questions: [
  { q: 'ماذا تعني هذه الإشارة؟', options: ['التوقف الكامل', 'التمهّل فقط', 'المتابعة بحذر'], answer: 0, image: 'images/signs/stop.svg' },
  { q: 'ماذا تعني هذه الإشارة؟', options: ['ممنوع الدخول', 'طريق مخصص للشاحنات', 'نهاية الطريق'], answer: 0, image: 'images/signs/no-entry.svg' },
  { q: 'ماذا تعني هذه الإشارة؟', options: ['أعطِ الأفضلية للمركبات الأخرى', 'قف دائماً', 'منعطف خطر'], answer: 0, image: 'images/signs/yield.svg' }
] });
