import type { Metadata } from "next";
import { Page } from "@/components/Page";

export const metadata: Metadata = {
  title: "සේවා නියමයන්",
  description: "Tilers Hub සඳහා සේවා නියමයන් - අපගේ වේදිකාව භාවිතයට අදාල නියමයන් සහ කොන්දේසි කියවන්න.",
};

export default function TermsPage() {
  return (
    <Page title="සේවා නියමයන්">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-neutral-600 mb-4">අවසන් යාවත්කාලීන කිරීම: ජනවාරි 2026</p>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-2">1. නියමයන් පිළිගැනීම</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Tilers Hub වෙත ප්‍රවේශ වීම සහ භාවිතා කිරීම මගින්, ඔබ මෙම සේවා නියමයන් පිළිගන්නා බවත්
                ඒවාට බැඳී සිටීමට එකඟ බවත් පෙන්වයි. මෙම නියමයන්ට එකඟ නොවේ නම්, ඔබ අපගේ වේදිකාව භාවිතා නොකළ යුතුය.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">2. පරිශීලක ගිණුම්</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                ඔබගේ ගිණුම් විස්තර රහසිගතව තබා ගැනීම සහ ඔබගේ ගිණුම හරහා සිදුවන සියලු ක්‍රියාකාරකම් සඳහා
                ඔබ වගකිව යුතුය. ඔබගේ ගිණුම අනධිකාරී ලෙස භාවිතා කිරීමක් සිදුවුවහොත්, වහාම අපව දැනුම් දිය යුතුය.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">3. පරිශීලක වගකීම්</h2>
              <p className="text-neutral-700 text-sm leading-relaxed mb-2">
                Tilers Hub පරිශීලකයෙකු ලෙස, ඔබ පහත දේවල් පිළිගන්නා බව දක්වයි:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm">
                <li>නිවැරදි සහ සත්‍ය තොරතුරු ලබා දීම</li>
                <li>ඔබගේ හැඳුනුම, දක්ෂතා හෝ කාර්ය ඉතිහාසය වැරදි ලෙස පෙන්වීම නොකිරීම</li>
                <li>සියලු ගනුදෙනු වෘත්තීයමය සහ නීතිගත ලෙස සිදු කිරීම</li>
                <li>අමුතු, අපහාසකාරී, හෝ අසුදුසු අන්තර්ගත පළ නොකිරීම</li>
                <li>අන් අයගේ බුද්ධිමත් දේපල හිමිකම් ගෞරව කිරීම</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">4. සේවාව සපයීම</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Tilers Hub යනු නිවාස හිමියන් සහ කාර්යකරුවන් සම්බන්ධ කරන වේදිකාවක් පමණි. අපි ටයිල් සේවාවන්
                සෘජුවම ලබා නොදේ, සහ අපගේ වේදිකාවේ කාර්යකරුවන් අප විසින් රැකියා ලබා දීමක් හෝ අධීක්ෂණයක් සිදු නොකරයි.
                සියලු ගිවිසුම් සම්බන්ධතා සෘජුවම නිවාස හිමියන් සහ කාර්යකරුවන් අතර වේ.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">5. ගෙවීම් සහ ගාස්තු</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                ගෙවීම් ගිවිසුම් නිවාස හිමියන් සහ කාර්යකරුවන් අතර සෘජුවම සකස් කරගනියි. ගෙවීම් විවාද හෝ
                ගෙවීම් නොකිරීම් සම්බන්ධයෙන් Tilers Hub වගකියන්නේ නැත. අපගේ වේදිකාව භාවිතා කිරීම සඳහා
                කිසියම් ගාස්තු තිබේ නම් ඒවා පැහැදිලිව පරිශීලකයින්ට දැනුම් දේ.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">6. වගකීම් සීමා කිරීම</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                අපගේ වේදිකාව භාවිතයෙන් උදාවන ඕනෑම හානියක් සඳහා Tilers Hub වගකියන්නේ නැත. මෙයට දේපල හානි,
                පුද්ගලික තුවාල, ආර්ථික අලාභ හෝ පරිශීලකයින් අතර විවාද ඇතුළත් විය හැක. ඔබ අපගේ සේවාව භාවිතා කරන්නේ
                ඔබගේම අවදානම මතය.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">7. අන්තර්ගත හිමිකම</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                ඔබ Tilers Hub හි පළ කරන සියලු අන්තර්ගතයන්ගේ හිමිකම ඔබ සතුවම පවතී. අන්තර්ගතය පළ කිරීම මඟින්
                අපගේ වේදිකාවේ එය භාවිතා කිරීමට, පෙන්වීමට, සහ බෙදා හැරීමට අපට අමතර නොවන බලපත්‍රයක් ලබා දෙයි.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">8. අවසන් කිරීම</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                මෙම නියමයන් උල්ලංඝනය කිරීම, වංචා ක්‍රියාකාරකම්, හෝ අපගේ වේදිකාව සහ පරිශීලකයින් ආරක්ෂා කිරීමට
                අවශ්‍ය යැයි අපි සැලකෙන වෙනත් හේතු සඳහා, ඔබගේ ගිණුම කාලයක් සඳහා අත්හිටුවීමට හෝ අවසන් කිරීමට
                අපට අයිතිය ඇත.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">9. විවාද විසඳීම</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                අපගේ වේදිකාව භාවිතයෙන් උදාවන විවාද යහපත් ආකාරයේ සාකච්ඡා මඟින් විසඳිය යුතුය. සාකච්ඡා අසාර්ථක වුවහොත්,
                එම විවාද ශ්‍රී ලංකා නීති වලට යටත් වේ.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">10. නියමයන්ට වෙනස්කම්</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                මෙම නියමයන් අපි ඕනෑම වෙලාවක සංශෝධනය කළ හැක. වෙනස්කම් සිදු කිරීමෙන් පසු වේදිකාව දිගටම භාවිතා කිරීම
                සංශෝධිත නියමයන් පිළිගැනීම ලෙස සැලකේ.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">11. සම්බන්ධතා තොරතුරු</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                මෙම නියමයන් පිළිබඳ ප්‍රශ්න සඳහා legal@tilershub.lk වෙත අපව සම්බන්ධ කරන්න.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
