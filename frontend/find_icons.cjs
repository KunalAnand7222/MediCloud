const fs = require('fs');
const content = fs.readFileSync('src/pages/index.jsx', 'utf-8');
let used = new Set();
// match <Component ...
let m1 = content.match(/<([A-Z][a-zA-Z]+)[\s>]/g);
if (m1) m1.forEach(m => used.add(m.slice(1, -1)));
// match icon: Component
let m2 = content.match(/icon:\s*([A-Z][a-zA-Z]+)[,\}]/g);
if (m2) m2.forEach(m => used.add(m.match(/[A-Z][a-zA-Z]+/)[0]));
// match { Component } or similar? 
// let's just match any Capitalized word that is not a known global or standard React component!
// It's easier:
let allCaps = content.match(/\b[A-Z][a-zA-Z]+\b/g);
if (allCaps) allCaps.forEach(c => used.add(c));
// Just list all uppercase words that might be icons (we can visually scan it or just inject all lucide-react icons from my script)
console.log(Array.from(used).filter(c => !['React','Link','useNavigate','useParams','useLocation','useSearchParams','useAuth','DashboardLayout','LoadingSpinner','generateReport', 'Navbar','div','span','button','p','h1','h2','h3','h4','a','img','svg','input','form','label','select','option','textarea'].includes(c)).join(', '));
