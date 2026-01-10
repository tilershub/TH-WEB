import { Page } from "@/components/Page";
import Link from "next/link";

export default function SupportPage() {
  return (
    <Page title="සහාය">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">නිතර අසන ප්‍රශ්න</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">කාර්යයක් පළ කරන්නේ කෙසේද?</h3>
              <p className="text-neutral-700 text-sm">
                නාවිගේෂන් මෙනුවෙන් "කාර්යය පළ කරන්න" බොත්තම ක්ලික් කරන්න. ඔබගේ ව්‍යාපෘති විස්තර පුරවා,
                ඡායාරූප තිබේ නම් එක් කර, අයවැය පරාසය නියම කරන්න. ඔබගේ කාර්යය වහාම කාර්යකරුවන්ට පෙනේ.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">සත්‍යාපිත කාර්යකරුවකු වන්නේ කෙසේද?</h3>
              <p className="text-neutral-700 text-sm">
                ගිණුමක් ලියාපදිංචි කර, ඔබගේ භූමිකාව ලෙස "කාර්යකරු" තෝරා, පැතිකඩ සැකසුම සම්පූර්ණ කරන්න.
                ව්‍යාපෘති දැනුම්දීම් ලබා ගැනීමට ඔබගේ ගාස්තු, පෝර්ට්ෆෝලියෝ ඡායාරූප සහ සම්බන්ධතා තොරතුරු එක් කරන්න.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">ගාස්තු කීයක්ද?</h3>
              <p className="text-neutral-700 text-sm">
                නිවාස හිමියන් සඳහා කාර්ය පළ කිරීම සහ කාර්යකරුවන් සොයීම සම්පූර්ණයෙන්ම නොමිලේ වේ. කාර්යකරුවන්ට
                පැතිකඩ සාදා ව්‍යාපෘති සඳහා බිඩ් දීමට කිසිදු ගාස්තුවක් නැත. අපි රහසිගත ගාස්තු රහිත පැහැදිලි මිල ගණන්වලට විශ්වාස කරමු.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">කාර්යකරුවන්/නිවාස හිමියන් සමඟ සන්නිවේදනය කරන්නේ කෙසේද?</h3>
              <p className="text-neutral-700 text-sm">
                බිඩ් එකක් දමන ලද්දේ පසු ඔබට අපගේ ඇතුළත් පණිවිඩ පද්ධතිය භාවිතා කර ව්‍යාපෘති විස්තර කතා කරන්න,
                මිල ගණන් සාකච්ඡා කරන්න, සහ කාලසටහන් සම්බන්ධීකරණය කරන්න. ඔබගේ සංවාද Messages ටැබයෙන් ප්‍රවේශ විය හැක.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">ගෙවීම් ක්‍රමය කෙසේද?</h3>
              <p className="text-neutral-700 text-sm">
                ගෙවීම් කොන්දේසි නිවාස හිමියන් සහ කාර්යකරුවන් අතර සෘජුවම සකස් කරගනියි. ඕනෑම ව්‍යාපෘතියක් ආරම්භ කිරීමට පෙර
                ගෙවීම් කාලසටහන් සහ ඉලක්ක පිළිබඳ කතාබහ කර එකඟ වීමට නිර්දේශ කරමු.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">මට විවාදයක් තිබුණහොත් කුමක්ද?</h3>
              <p className="text-neutral-700 text-sm">
                පැහැදිලි සන්නිවේදනය සහ ලිඛිත එකඟතාවයන් අපි දිරිමත් කරමු. ගැටළු ඇතිවුණහොත්,
                <Link href="/contact" className="text-blue-600 hover:underline">සම්බන්ධතා පිටුව</Link> හරහා අපගේ සහාය කණ්ඩායම වෙත සම්බන්ධ වන්න.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">තවත් උදව් අවශ්‍යද?</h2>
          <p className="text-neutral-700 mb-3">
            ඔබ සොයන පිළිතුර හමු නොවුණාද? අපගේ සහාය කණ්ඩායම සමඟ සම්බන්ධ වන්න.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800"
          >
            සහාය සම්බන්ධ කරන්න
          </Link>
        </section>
      </div>
    </Page>
  );
}
