import type { Metadata } from "next";
import { Page } from "@/components/Page";

export const metadata: Metadata = {
  title: "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
  description: "Tilers Hub සඳහා පෞද්ගලිකත්ව ප්‍රතිපත්තිය - ඔබගේ පුද්ගලික තොරතුරු අප සඟවා, භාවිතා කරන සහ ආරක්ෂා කරන ආකාරය දැනගන්න.",
};

export default function PrivacyPage() {
  return (
    <Page title="පෞද්ගලිකත්ව ප්‍රතිපත්තිය">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-neutral-600 mb-4">අවසන් යාවත්කාලීන කිරීම: ජනවාරි 2026</p>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-2">1. අපි සමුද්ග්‍රහ කරන තොරතුරු</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                ඔබ ගිණුමක් සාදන විට, කාර්යයක් පළ කරන විට, බිඩ් ඉදිරිපත් කරන විට හෝ අපගේ වේදිකාව හරහා සන්නිවේදනය කරන විට
                ඔබ සෘජුවම අප වෙත ලබා දෙන තොරතුරු අපි එකතු කරගනිමු. මෙයට ඔබගේ නම, ඊමේල් ලිපිනය, දුරකථන අංකය,
                ස්ථාන තොරතුරු සහ ඡායාරූප හා පණිවිඩ වැනි ඔබ බෙදාගන්නා අන්තර්ගතයන් ඇතුළත් වේ.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">2. ඔබගේ තොරතුරු භාවිතා කරන ආකාරය</h2>
              <p className="text-neutral-700 text-sm leading-relaxed mb-2">
                අපි එකතු කරන තොරතුරු මෙවැනි අරමුණු සඳහා භාවිතා කරමු:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm">
                <li>අපගේ සේවාවන් ලබා දීම, පවත්වාගෙන යාම, සහ වැඩිදියුණු කිරීම</li>
                <li>නිවාස හිමියන් සහ කාර්යකරුවන් සම්බන්ධ කර සන්නිවේදනය පහසු කිරීම</li>
                <li>තාක්ෂණික දැනුම්දීම්, යාවත්කාලීන කිරීම් සහ සහාය පණිවිඩ යැවීම</li>
                <li>ඔබගේ අදහස්, ප්‍රශ්න, සහ ඉල්ලීම්වලට ප්‍රතිචාර දීම</li>
                <li>ප්‍රවණතා, භාවිතය, සහ ක්‍රියාකාරකම් නිරීක්ෂණය හා විශ්ලේෂණය</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">3. තොරතුරු බෙදාගැනීම</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                අපගේ සේවාවන් ලබා දීමට අවශ්‍ය අවස්ථාවලදී ඔබගේ තොරතුරු අනෙකුත් පරිශීලකයින් සමඟ බෙදා ගනිමු. උදාහරණයක් ලෙස,
                ඔබ කාර්යයක් පළ කරන විට එම තොරතුරු ඔබගේ ව්‍යාපෘතියට බිඩ් කළ හැකි කාර්යකරුවන්ට පෙනේ.
                අපි ඔබගේ පුද්ගලික තොරතුරු තෙවන පාර්ශ්වයන්ට විකිණන්නේ නැත.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">4. දත්ත ආරක්ෂාව</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                අනධිකාරී ප්‍රවේශය, අහිමි වීම, අනිසි භාවිතය හෝ වෙනස් කිරීමේ සිට ඔබගේ තොරතුරු ආරක්ෂා කිරීමට
                සාධාරණ පියවර ගනිමු. එහෙත්, අන්තර්ජාල සම්ප්‍රේෂණයක් සම්පූර්ණයෙන්ම ආරක්ෂිත නොවන බැවින්
                සම්පූර්ණ ආරක්ෂාවක් උත්සාහ කරන බවට අපට සහතික කළ නොහැක.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">5. ඔබගේ අයිතිවාසිකම්</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                ඔබගේ ගිණුම් සැකසීම් හරහා ඔබට ඕනෑම වේලාවක ඔබගේ පුද්ගලික තොරතුරු නරඹා, යාවත්කාලීන කර,
                හෝ මකා දැමීමට අයිතිය ඇත. ඔබ සම්බන්ධයෙන් අප සතුව ඇති දත්ත පිළිබඳ තොරතුරු ඉල්ලා
                අප වෙත සම්බන්ධ විය හැක.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">6. කුකීස් සහ වෙළඳ දැන්වීම්</h2>
              <p className="text-neutral-700 text-sm leading-relaxed mb-2">
                අපගේ වේදිකාවේ ක්‍රියාකාරකම් නිරීක්ෂණය කිරීමට සහ ඇතැම් තොරතුරු සුරැකීමට කුකීස් සහ සමාන
                ලුහුබැඳීමේ තාක්ෂණ භාවිතා කරමු. මෙයට ඇතුළත් වේ:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm mb-2">
                <li><strong>අත්‍යවශ්‍ය කුකීස්:</strong> වේදිකාව නිසි ලෙස ක්‍රියා කිරීමට අවශ්‍ය වේ.</li>
                <li><strong>විශ්ලේෂණ කුකීස්:</strong> පරිශීලකයන් අපගේ වේදිකාව සමඟ කෙසේ ක්‍රියාකරයිද යන්න අවබෝධ කර ගැනීමට උදව් කරයි.</li>
                <li><strong>වෙළඳ දැන්වීම් කුකීස්:</strong> සම්බන්ධිත දැන්වීම් පෙන්වීමට අපගේ දැන්වීම් හවුල්කරුවන් භාවිතා කරයි.</li>
              </ul>
              <p className="text-neutral-700 text-sm leading-relaxed mb-2">
                <strong>තෙවන පාර්ශ්ව වෙළඳ දැන්වීම්:</strong> අපගේ වේදිකාවේ දැන්වීම් පෙන්වීම සඳහා Google AdSense භාවිතා කරමු.
                Google සහ අනෙකුත් තෙවන පාර්ශ්ව වෙළඳුන් ඔබගේ පෙර ගමන්බැසීම් මත පදනම්ව දැන්වීම් පෙන්වීමට කුකීස් භාවිතා කරයි.
              </p>
              <p className="text-neutral-700 text-sm leading-relaxed">
                පුද්ගලීකරණය කළ දැන්වීම් වලින් ඉවත් වීමට{" "}
                <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Ad Settings
                </a> වෙත පිවිසිය හැක. එසේම{" "}
                <a href="https://www.aboutads.info/choices/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  aboutads.info
                </a> වෙත පිවිස තෙවන පාර්ශ්ව කුකීස් වලින් ඉවත් විය හැක.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">7. දරුවන්ගේ පෞද්ගලිකත්වය</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                අපගේ සේවාව වයස 18 ට අඩු පරිශීලකයින් සඳහා නොවේ. වයස 18 ට අඩු දරුවන්ගෙන්
                අපි දැනුවත්වම පුද්ගලික තොරතුරු එකතු කරන්නේ නැත.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">8. මෙම ප්‍රතිපත්තියට වෙනස්කම්</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                මෙම පෞද්ගලිකත්ව ප්‍රතිපත්තිය අපි කලින් කලට යාවත්කාලීන කළ හැක. නව ප්‍රතිපත්තිය මෙම පිටුවේ පළ කර
                "අවසන් යාවත්කාලීන" දිනය යාවත්කාලීන කිරීම මගින් වෙනස්කම් ගැන ඔබට දැනුම් දේ.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">9. අපව සම්බන්ධ කරන්න</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                මෙම පෞද්ගලිකත්ව ප්‍රතිපත්තිය පිළිබඳ ප්‍රශ්න ඇත්නම්, privacy@tilershub.lk වෙත අපව සම්බන්ධ කරන්න.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
