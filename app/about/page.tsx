import { Page } from "@/components/Page";

export default function AboutPage() {
  return (
    <Page title="Tilers Hub ගැන">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">අපගේ මෙහෙවර</h2>
          <p className="text-neutral-700 leading-relaxed">
            Tilers Hub ශ්‍රී ලංකා පුරා ඇති දක්ෂ ටයිල් වෘත්තියවේදීන් හා නිවාස හිමියන් සම්බන්ධ කරයි.
            සුදුසු කාර්යකරුවන් සොයාගැනීම, මිල ගණන් සසඳීම සහ විශ්වාසයෙන් ඔබගේ ටයිල් ව්‍යාපෘති ඉටු කිරීම අපි පහසු කරමු.
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">එය කෙසේ ක්‍රියා කරන්නේද</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">නිවාස හිමියන් සඳහා</h3>
              <p className="text-neutral-700 text-sm">
                ඡායාරූප සහ විස්තර සමඟ ඔබගේ ටයිල් ව්‍යාපෘතිය පළ කරන්න. ඔබගේ ප්‍රදේශයේ සුදුසු කාර්යකරුවන්ගෙන් බිඩ් ලබාගන්න.
                ඔබගේ කාර්යය සඳහා නිවැරදි වෘත්තියවේදියාව තෝරා ගැනීමට පෙර ඔවුන්ගේ පැතිකඩ, ගාස්තු, සහ පෝර්ට්ෆෝලියෝ සමාලෝචනය කරන්න.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">කාර්යකරුවන් සඳහා</h3>
              <p className="text-neutral-700 text-sm">
                ඔබගේ හැකියාවන්, ගාස්තු සහ පෙර කාර්යයන් පෙන්වන පැතිකඩක් සාදන්න. ඔබගේ ප්‍රදේශයේ ලබාගත හැකි ව්‍යාපෘති
                සොයා තරඟකාරී බිඩ් ඉදිරිපත් කරන්න. නිවාස හිමියන් සමඟ සෘජුව සම්බන්ධ වී ඔබගේ ව්‍යාපාරය වර්ධනය කරන්න.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">Tilers Hub තෝරන්නේ ඇයි</h2>
          <ul className="space-y-2 text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm">පෝර්ට්ෆෝලියෝ සහිත සත්‍යාපිත ටයිල් වෘත්තියවේදීන්</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm">පැහැදිලි මිල ගණන් සහ තරඟකාරී බිඩ්</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm">නිවාස හිමියන් හා කාර්යකරුවන් අතර සෘජු සන්නිවේදනය</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm">සහජ ව්‍යාපෘති කළමනාකරණය සහ අනුගමනය</span>
            </li>
          </ul>
        </section>
      </div>
    </Page>
  );
}
