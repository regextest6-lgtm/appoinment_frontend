import Link from "next/link";

export default function FacilitiesSection() {
  return (
    <section className="w-full bg-[#F4FBFA] py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* LEFT CONTENT */}
        <div>
          <span className="flex items-center gap-3 text-teal-600 font-semibold tracking-wide mb-4">
            <span className="w-10 h-[2px] bg-teal-400"></span>
            OUR FACILITIES
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Facilities That We <br /> Provide
          </h2>

          <p className="text-gray-600 mt-6 max-w-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim metus nec
            fringilla accumsan.
          </p>

          <Link href={'/services'}>
          <button className="mt-10 inline-flex items-center gap-2 px-6 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition">
            View All
            <span className="text-lg">→</span>
          </button>
          </Link>
        </div>

        {/* RIGHT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Column 1 */}
          <div className="flex flex-col gap-8">
            <FacilityCard
              title="Outdoor Service"
              icon="🚑"
            />
            <FacilityCard
              title="Emergency Care"
              icon="🚨"
            />
          </div>

          {/* Column 2 (slightly offset vertically) */}
          <div className="flex flex-col gap-8 mt-12">
            <FacilityCard
              title="Instant Operation"
              icon="🩺"
            />
            <FacilityCard
              title="Private & Secure"
              icon="🔒"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Facility Card */
interface FacilityCardProps {
  title: string;
  icon: React.ReactNode;
}

function FacilityCard({ title, icon }: FacilityCardProps) {
  return (
    <div className="bg-[#46C8B1] rounded-xl p-8 text-white shadow-lg">
      <div className="w-12 h-12 rounded-full bg-white text-teal-500 flex items-center justify-center text-xl mb-6">
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-3">{title}</h3>

      <p className="text-white/90 text-sm leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipiscing elit. Etiam eu turpis
        molestie.
      </p>
    </div>
  );
}
