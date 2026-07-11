import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ShieldAlert, FileText, Truck, RefreshCw, Cookie } from 'lucide-react';

type LegalTab = 'privacy' | 'terms' | 'shipping' | 'returns' | 'cookies';

export default function Legal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<LegalTab>('privacy');

  useEffect(() => {
    const tabParam = searchParams.get('tab') as LegalTab;
    if (tabParam && ['privacy', 'terms', 'shipping', 'returns', 'cookies'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: LegalTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldAlert },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    { id: 'returns', label: 'Return Policy', icon: RefreshCw },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie }
  ] as const;

  return (
    <PageContainer>
      <div className="min-h-screen bg-[#FBFBFA] pt-28 pb-20 px-6 md:px-16 font-sans text-[#1C1C1B]">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-neutral-400 block mb-3">
              Legal Documentation
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-light text-primary-container">
              Studio Policies & Terms
            </h1>
            <p className="font-sans text-xs text-neutral-400 mt-2">
              This platform and the brand Two Threads Studio are legally operated by SYS Pvt. Ltd.
            </p>
          </div>

          {/* Layout Container */}
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Left Column Tabs Selector */}
            <aside className="w-full lg:w-1/4 flex flex-col gap-1 bg-[#FAF9F7] p-4 border border-neutral-200/60 rounded-sm">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 font-medium font-sans text-[11px] tracking-widest uppercase transition-all border-none cursor-pointer rounded-sm ${
                      activeTab === tab.id
                        ? 'text-[#A34A38] bg-white font-semibold shadow-sm border-l-2 border-[#A34A38]'
                        : 'text-neutral-500 hover:text-[#1C1C1B] hover:bg-neutral-100 bg-transparent'
                    }`}
                  >
                    <IconComponent size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* Right Column Content */}
            <main className="w-full lg:w-3/4 bg-white p-8 md:p-12 border border-neutral-200/60 rounded-sm shadow-sm min-h-[450px]">
              <ScrollReveal direction="up" key={activeTab}>
                
                {/* 1. PRIVACY POLICY */}
                {activeTab === 'privacy' && (
                  <article className="prose prose-neutral max-w-none">
                    <h2 className="font-serif text-2xl font-normal text-[#1C1C1B] mb-6">Privacy Policy</h2>
                    <p className="font-sans text-xs text-neutral-400 mb-6 uppercase tracking-wider">Last Updated: July 2026</p>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      Your privacy is extremely important to us. It is the policy of <strong>SYS Pvt. Ltd.</strong> (operating as <strong>Two Threads Studio</strong>) to respect your privacy regarding any information we may collect while operating our website. Accordingly, we have developed this Privacy Policy in order for you to understand how we collect, use, communicate, disclose and otherwise make use of personal information.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">1. Information We Collect</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      We collect personal information such as names, shipping addresses, billing addresses, email addresses, and payment detail updates when you purchase products, register an account, or subscribe to our newsletter.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">2. Use of Information</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      All collected information is processed by SYS Pvt. Ltd. to fulfill your orders, provide customer support, ship materials, manage your artisan membership, and personalize your experience on Two Threads Studio.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">3. Data Sharing & Security</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      We secure your personal data using industry-standard protocols. We never sell your personal information. Data is only shared with trusted third parties (such as logistics partners and payment processors) strictly to facilitate transaction and shipping fulfillment.
                    </p>
                  </article>
                )}

                {/* 2. TERMS & CONDITIONS */}
                {activeTab === 'terms' && (
                  <article className="prose prose-neutral max-w-none">
                    <h2 className="font-serif text-2xl font-normal text-[#1C1C1B] mb-6">Terms & Conditions</h2>
                    <p className="font-sans text-xs text-neutral-400 mb-6 uppercase tracking-wider">Last Updated: July 2026</p>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      This website is owned and operated by <strong>SYS Pvt. Ltd.</strong> Throughout the site, the terms "we", "us", and "our" refer to SYS Pvt. Ltd., operating under the brand name <strong>Two Threads Studio</strong>. By visiting our site and/or purchasing products from us, you engage in our "Service" and agree to be bound by these terms and conditions.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">1. Online Store Terms</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">2. Pricing and Modifications</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      Prices for our embroidery kits, patterns, and materials are subject to change without notice. SYS Pvt. Ltd. reserves the right to modify or discontinue any product or service at any time.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">3. Intellectual Property</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      All stitch patterns, illustrations, designs, instructional PDFs, and brand collateral hosted on this website are the intellectual property of SYS Pvt. Ltd. unauthorized copying, resale, or distribution of our kits or digital products is strictly prohibited.
                    </p>
                  </article>
                )}

                {/* 3. SHIPPING POLICY */}
                {activeTab === 'shipping' && (
                  <article className="prose prose-neutral max-w-none">
                    <h2 className="font-serif text-2xl font-normal text-[#1C1C1B] mb-6">Shipping Policy</h2>
                    <p className="font-sans text-xs text-neutral-400 mb-6 uppercase tracking-wider">Last Updated: July 2026</p>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      All orders placed through Two Threads Studio are processed, fulfilled, and shipped by <strong>SYS Pvt. Ltd.</strong> or our authorized global logistics networks. We aim to dispatch orders with care, intention, and speed.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">1. Processing Times</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      Because our custom engraving plates and premium linen cuts are prepared to order, please allow 1-2 business days for package assembly.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">2. Delivery Estimates</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      - Domestic (India): 3-5 business days via standard courier.<br/>
                      - International: 7-14 business days. Note that customs fees and import duties are the responsibility of the recipient.
                    </p>
                  </article>
                )}

                {/* 4. RETURN POLICY */}
                {activeTab === 'returns' && (
                  <article className="prose prose-neutral max-w-none">
                    <h2 className="font-serif text-2xl font-normal text-[#1C1C1B] mb-6">Return & Refund Policy</h2>
                    <p className="font-sans text-xs text-neutral-400 mb-6 uppercase tracking-wider">Last Updated: July 2026</p>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      We want you to be fully satisfied with your purchase. Returns are processed under the business direction of <strong>SYS Pvt. Ltd.</strong> on behalf of <strong>Two Threads Studio</strong>.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">1. Physical Kits & Materials</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      We offer a 30-day return policy for any physical embroidery kits or materials, provided the product remains completely unopened, unused, and in its original premium packaging. Return shipping costs are covered by the customer.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">2. Digital Downloads & Courses</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      Due to the instant nature of digital files, all downloadable patterns and online video tutorials are final sale and non-refundable.
                    </p>
                  </article>
                )}

                {/* 5. COOKIE POLICY */}
                {activeTab === 'cookies' && (
                  <article className="prose prose-neutral max-w-none">
                    <h2 className="font-serif text-2xl font-normal text-[#1C1C1B] mb-6">Cookie Policy</h2>
                    <p className="font-sans text-xs text-neutral-400 mb-6 uppercase tracking-wider">Last Updated: July 2026</p>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      This Cookie Policy explains how <strong>SYS Pvt. Ltd.</strong> uses cookies and similar tracking technologies on our website, <strong>Two Threads Studio</strong>.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">1. Why We Use Cookies</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      We use cookies to maintain your shopping cart state, keep you signed in, remember your wishlist items, and analyze site traffic so we can refine our user experience and boutique services.
                    </p>
                    <h3 className="font-serif text-lg text-[#1C1C1B] mb-3 mt-8">2. Managing Cookies</h3>
                    <p className="font-sans text-sm text-[#5a4a3f] leading-relaxed mb-6">
                      You can instruct your browser to refuse all cookies or notify you when a cookie is sent. However, if you disable cookies, some sections of our storefront (such as the cart and checkout) may not function correctly.
                    </p>
                  </article>
                )}

              </ScrollReveal>
            </main>

          </div>
        </div>
      </div>
    </PageContainer>
  );
}
