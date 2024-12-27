import Marquee from "./ui/marquee";
import { cn } from "./../lib/utils";

const categories = [
  {
    title: "Former Lead Product Manager at Stripe",
    description:
      "Played a key role in building a $70 billion USD company with successful entrepreneurial exits to Twitter and Intuit. Fortune’s Top 40 Under 40 and Stanford Alumnus.",
  },
  {
    title: "Ex-Executive Director at the Reserve Bank of India",
    description:
      "Directed supervision and fintech strategy; oversaw 5,000 NBFCs, collaborated with global regulatory bodies, and contributed to the Basel Committee on Banking Supervision.",
  },
  {
    title: "Deputy Legal Advisor at Enforcement Directorate, India",
    description:
      "Expert in legal and investigative actions for money laundering (PMLA) and foreign exchange violations (FEMA).",
  },
  {
    title: "Retired Deputy Director, Enforcement Directorate, India",
    description:
      "Specialist in handling high-stakes financial investigations, ensuring strict adherence to compliance laws.",
  },
  {
    title:
      "Senior Officer, Economic Affairs, Consulate General of Canada in Hong Kong",
    description:
      "Extensive experience in foreign policy and economic strategy across international markets.",
  },

  {
    title: "20+ Year Veteran of Western Union",
    description:
      "Former Global Head of Digital Payments, driving business across 200 countries. Advisor to Saudi National Bank, LBS, and INSEAD Alumnus.",
  },
  {
    title: "Director at Oliver Wyman",
    description:
      "Expert in public sector transformation and large-scale government initiatives in GCC nations.",
  },
  {
    title: "Emerging Markets Investor",
    description:
      "Two decades of experience raising capital from top global financial institutions, including DFC, IFC, and USAID.",
  },

  {
    title: "Chartered Quantity Surveyor (MRICS) and Arbitrator (MCIArb)",
    description:
      "Managed $5bn+ in construction projects across Europe, the Middle East, and Asia.",
  },
  {
    title: "Chief Administrative Officer & CFO",
    description:
      "Part of the executive leadership at a European QSR platform managing brands like Burger King and Dunkin’.",
  },
  {
    title: "Fintech Co-Founder and Strategic Sales Leader",
    description:
      "Proven record of SaaS monetization ($0-$10m), enterprise sales ($5m-$100m), and commercial market growth of $300m+ annually.",
  },

  {
    title: "Former Group Chief Marketing Officer at Nykaa",
    description:
      "Drove branding for the $7.4 billion beauty e-commerce giant and served as CMO at L’Oréal India.",
  },
  {
    title: "Co-Founder of a Premier Digital Marketing Agency",
    description:
      "Expertise in leveraging social media to drive customer acquisition at scale.",
  },
  {
    title: "Chief Marketing Officer of Myntra",
    description: "Spearheaded growth for the $200m fashion marketplace.",
  },
  {
    title: "Senior Editor & Anchor, Times Network",
    description:
      "Media powerhouse with a strong understanding of public outreach.",
  },

  {
    title: "CEO and Founder of a Cybersecurity Culture Company",
    description:
      "25+ years in information security, bestselling author of The Security Culture Playbook and Build a Security Culture.",
  },
  {
    title: "A Visionary Coach and Trainer",
    description:
      "Passionate about empowering individuals and organizations to achieve purpose-driven goals.",
  },
  {
    title: "Norwegian Entrepreneur in Kenya",
    description:
      "Expanded operations to 450 partner hotels across 15 countries, including a merger with a Polish hotel booking platform.",
  },
  {
    title: "Chairman & Editor-in-Chief at BW Businessworld",
    description: "Leading thinker in business journalism and strategy.",
  },
];



const CategoryCard = ({
  title,
  description,
}: {
  title: string;

  description: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-white-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"

      )}
    >
      <div className="flex flex-row items-center   gap-2">
        <div className="flex flex-col">
          <figcaption className="text-[15px] font-medium  dark:text-white">
            {title}
          </figcaption>
        </div>
      </div>

      <blockquote className="mt-2 text-sm  ">{description}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background ">
      <Marquee pauseOnHover className="[--duration:20s]">
        {categories.map((category, index) => (
          <CategoryCard key={index} {...category} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background dark:from-background"></div>
    </div>
  );
}
