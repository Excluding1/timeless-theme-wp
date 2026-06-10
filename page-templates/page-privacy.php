<?php /* Template Name: Privacy Policy */ ?>
<?php get_header(); ?>

<!-- BREADCRUMB -->
<div class="pt-24 pb-2 px-6 sm:px-8 max-w-7xl mx-auto">
 <nav class="text-xs text-secondary" aria-label="Breadcrumb">
 <ol class="flex items-center gap-1">
 <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary transition-colors">Home</a></li>
 <li><span class="mx-1">/</span></li>
 <li class="text-primary font-medium">Privacy Policy</li>
 </ol>
 </nav>
</div>

<!-- PRIVACY POLICY CONTENT -->
<section class="pt-4 pb-16 sm:pb-20 bg-surface">
 <div class="max-w-3xl mx-auto px-6 sm:px-8">

 <h1 class="text-4xl sm:text-5xl font-extrabold text-primary tracking-tighter leading-[0.95] mb-2">Privacy Policy</h1>
 <p class="text-sm text-outline mb-10"><strong>Last updated:</strong> 5 May 2026</p>

 <div class="space-y-10 text-secondary text-base leading-relaxed">

 <!-- 1. ABOUT -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">1. About this Privacy Policy</h2>
 <p class="mb-3">This Privacy Policy explains how Timeless Resurfacing (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses, holds, and discloses personal information.</p>
 <p class="mb-3">We have drafted this Policy to comply with the <strong>Privacy Act 1988 (Cth)</strong> and the <strong>Australian Privacy Principles (APPs)</strong>, even where we may not strictly be bound by the Act due to our current size (the small-business exemption may apply while turnover is under $3 million per year). We do this because our customers are entitled to know how their information is handled regardless of whether the law mandates it.</p>
 <p>By submitting an enquiry, requesting a quote, engaging us for services, or providing personal information through any of our channels, you agree to the practices described below.</p>
 </div>

 <!-- 2. WHO WE ARE -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">2. Who we are</h2>
 <div class="bg-white border border-surface-container rounded-xl p-6 space-y-2 mb-3">
 <p><strong>Business name:</strong> Timeless Resurfacing</p>
 <p><strong>Entity:</strong> Partnership</p>
 <p><strong>ABN:</strong> <?php echo timeless_abn(); ?></p>
 <p><strong>Business address:</strong> 87 Woodlands Road, Liverpool NSW 2170, Australia</p>
 <p><strong>State of operation:</strong> New South Wales</p>
 <p><strong>Service area:</strong> Sydney metropolitan area + surrounding NSW regions</p>
 <p><strong>Phone:</strong> <a href="tel:<?php echo timeless_phone_link(); ?>" class="text-primary underline"><?php echo timeless_phone(); ?></a></p>
 <p><strong>Privacy contact:</strong> <a href="mailto:support@timelessresurfacing.com.au" class="text-primary underline">support@timelessresurfacing.com.au</a></p>
 <p><strong>Website:</strong> <a href="https://timelessresurfacing.com.au" class="text-primary underline">https://timelessresurfacing.com.au</a></p>
 </div>
 <p>We provide bathroom resurfacing, shower regrouting, silicone replacement, and related restoration services. Work is performed by our qualified technicians.</p>
 </div>

 <!-- 3. INFORMATION COLLECTED -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">3. Personal information we may collect</h2>
 <p class="mb-3">We only collect information that is reasonably necessary for the work we do.</p>

 <h3 class="text-lg font-bold text-primary mt-6 mb-2">3.1 Contact and identification information</h3>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li>Full name (first + last)</li>
 <li>Email address</li>
 <li>Phone number (mobile and/or landline)</li>
 <li>Property address where work is to be performed (suburb at quote stage; full street address at booking stage)</li>
 <li>Postcode and suburb</li>
 </ul>

 <h3 class="text-lg font-bold text-primary mt-6 mb-2">3.2 Property and service information</h3>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li>Property type (house, apartment, townhouse, commercial)</li>
 <li>Customer type (owner-occupier, property manager, builder, tenant)</li>
 <li>Whether the property was built before 1990 (relevant for asbestos screening)</li>
 <li>Lift access details (for apartments)</li>
 <li>Tenant/landlord/owners-corporation authorisation details where applicable</li>
 <li>Description of the work required</li>
 <li>Strata flag and owners-corporation contact (if applicable)</li>
 </ul>

 <h3 class="text-lg font-bold text-primary mt-6 mb-2">3.3 Photographs</h3>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li>Photos of bathroom areas you upload via our quote form (showers, baths, tiles, basins, vanities, walls, floors, surrounds)</li>
 <li>Before-and-after photos taken by our team at the job site (for warranty + quality records)</li>
 </ul>
 <p class="mb-3">We treat photographs of your property as <strong>personal information</strong> under the Privacy Act, consistent with OAIC guidance. Photos can identify you directly (a person in the frame) or by context (the property address linked to your contact record). Photos are handled with the same care as your name and contact details.</p>
 <div class="bg-surface-container border border-surface-container rounded-xl p-4 mb-3">
 <p class="font-semibold text-primary mb-2">Customer guidance, please help us help you:</p>
 <p class="mb-2">When uploading bathroom photos, please <strong>avoid uploading photos showing</strong>:</p>
 <ul class="list-disc pl-6 space-y-1">
 <li>People (especially children)</li>
 <li>Identity documents (driver&rsquo;s licence, passport, Medicare card)</li>
 <li>Medicine labels or pill bottles</li>
 <li>Private documents (mail, bills, statements)</li>
 <li>Valuables (jewellery, electronics, cash)</li>
 <li>Rooms or areas not relevant to the bathroom work</li>
 </ul>
 <p class="mt-2 text-sm">We only need photos of the bathroom surfaces to be quoted on. Anything outside that scope, please leave out of the frame.</p>
 </div>

 <h3 class="text-lg font-bold text-primary mt-6 mb-2">3.4 Payment information</h3>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li>Bank account or card details processed via <strong>Stripe</strong> (United States)</li>
 <li>We <strong>do not store</strong> full card numbers, CVVs, or full bank account numbers on our own systems. Stripe handles payment processing under their own privacy policy and PCI-DSS compliance.</li>
 </ul>

 <h3 class="text-lg font-bold text-primary mt-6 mb-2">3.5 Communications records</h3>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li>Emails to/from us</li>
 <li>SMS messages to/from us</li>
 <li>Phone-call notes (substance, not recordings, unless we have given you specific notice)</li>
 <li>Quote, invoice, and warranty records</li>
 </ul>

 <h3 class="text-lg font-bold text-primary mt-6 mb-2">3.6 Technical information (collected automatically)</h3>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li>IP address</li>
 <li>Browser and device type / operating system</li>
 <li>Pages viewed and timestamps</li>
 <li>Referrer URL</li>
 <li>UTM parameters and Google Click ID (gclid) for advertising attribution</li>
 <li>Cookies (see &sect; 15)</li>
 </ul>

 <h3 class="text-lg font-bold text-primary mt-6 mb-2">3.7 What we do not ask for</h3>
 <p class="mb-2">We do not ask for, and you should not provide:</p>
 <ul class="list-disc pl-6 space-y-1">
 <li>Government identifiers (Medicare number, driver&rsquo;s licence, passport, Tax File Number), APP 9</li>
 <li>Financial account numbers beyond what Stripe needs for payment</li>
 <li>Sensitive information (health, race, religion, politics), these are not relevant to bathroom resurfacing</li>
 </ul>
 </div>

 <!-- 4. HOW WE COLLECT -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">4. How we collect personal information</h2>
 <ul class="list-disc pl-6 space-y-2">
 <li><strong>Directly from you</strong>, when you submit our quote form, call, email, SMS, message us via our website chat, or otherwise communicate.</li>
 <li><strong>Automatically</strong>, via website analytics (Google Analytics 4) and cookies.</li>
 <li><strong>From third parties</strong> (limited cases), for example, your landlord, property manager, or owners corporation if they engage us on your behalf, or a referrer who introduces you with your knowledge.</li>
 <li><strong>From our technicians</strong>, site notes and photos taken in the course of quoting or performing work.</li>
 </ul>
 <p class="mt-3">We will tell you, at the point of collection, what we are collecting and why (APP 5 notification). The quote form contains a short collection notice with a link to this Policy.</p>
 </div>

 <!-- 5. UNSOLICITED -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">5. Unsolicited information (APP 4)</h2>
 <p class="mb-3">If we receive personal information that we did not ask for and that we could not have lawfully collected under this Policy, we will, as soon as practicable, either destroy or de-identify that information (where lawful and reasonable).</p>
 <p>For example: if you upload a photo of an unrelated room with someone&rsquo;s medicine bottle in the corner, we will not use that information for any purpose; we will delete or crop it from our records as soon as we identify it.</p>
 </div>

 <!-- 6. ANONYMITY -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">6. Anonymity and pseudonymity (APP 2)</h2>
 <p class="mb-3">Where it is lawful and practicable, you may interact with us anonymously or under a pseudonym. For example, we can provide an indicative price guide on the phone without you giving us your full name. However, to provide a written quote, schedule work, send a confirmation, or issue an invoice we must collect your real name, contact details, and property address.</p>
 <p>If anonymity is important to you for an initial enquiry, please tell us, we will help you stay anonymous as far as it is workable.</p>
 </div>

 <!-- 7. PURPOSES -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">7. Why we collect personal information</h2>
 <p class="mb-3">We collect, hold, and use personal information for the following primary purposes:</p>
 <ul class="list-disc pl-6 space-y-2">
 <li>Preparing quotes for work you are requesting</li>
 <li>Delivering the services you have engaged us for</li>
 <li>Coordinating our technicians who perform the work</li>
 <li>Communicating with you about your quote, booking, job progress, completion, and warranty</li>
 <li>Processing payments (deposits, balance, variation invoices)</li>
 <li>Issuing invoices and receipts</li>
 <li>Meeting our legal, regulatory, and tax obligations (NSW Fair Trading, ATO, ACMA)</li>
 <li>Improving our website, quoting workflow, and services</li>
 <li>Sending you transactional communications</li>
 <li>Sending direct-marketing communications <strong>only where you have given consent</strong> under the Spam Act 2003</li>
 <li>Defending or pursuing a complaint, claim, or dispute</li>
 </ul>
 <p class="mt-3">We will not use your personal information for any purpose <strong>inconsistent</strong> with these without your consent or as otherwise permitted by law. Reasonable extensions of these purposes, for example, sending you a maintenance reminder for a previous job, contacting you about repeat-customer offers, or using anonymised job data for business analysis and benchmarking, are within these purposes and do not require fresh consent.</p>
 </div>

 <!-- 8. PHOTOS -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">8. Photographs, special handling and retention</h2>
 <p class="mb-3">Photos you submit (and that our team takes on-site) are used to:</p>
 <ul class="list-disc pl-6 space-y-2 mb-3">
 <li>Prepare an accurate quote</li>
 <li>Brief the technician assigned to your job</li>
 <li>Verify scope at job commencement</li>
 <li>Record before-and-after states for warranty and quality records</li>
 <li>Defend a warranty claim or insurance matter if necessary</li>
 <li><strong>Optionally</strong>, feature in our portfolio, website, social media, or marketing materials, <strong>only with your express consent</strong> (which may be obtained electronically, e.g. ticking a box on the quote form, replying YES to an email, or signing a consent at the job site, separate from the quote/booking consent)</li>
 </ul>
 <p class="mb-3">We do <strong>not</strong> publish, share, or use photographs in marketing materials without your consent. The quote form does not assume marketing consent.</p>

 <h3 class="text-lg font-bold text-primary mt-6 mb-2">Photo retention</h3>
 <p class="mb-2">We retain photographs while we have a legitimate business purpose, including:</p>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li>Active warranty period (up to 5 years for resurfacing, 5 years for epoxy regrouting, etc.)</li>
 <li>Tax and accounting record-keeping (minimum 5 years per ATO requirements; typically 7 years)</li>
 <li>Quality-assurance benchmarking against future jobs</li>
 <li>Reference for potential follow-up service or repeat engagement</li>
 <li>Defence of any complaint, warranty claim, or insurance matter</li>
 </ul>
 <p class="mb-3">There is no automatic delete schedule. You can ask us to delete photos at any time by emailing <a href="mailto:support@timelessresurfacing.com.au" class="text-primary underline">support@timelessresurfacing.com.au</a>, we will delete them unless we have a legal obligation to retain them (e.g. an open warranty claim or a current tax-record retention requirement).</p>
 <p>You can withdraw consent for <strong>marketing use</strong> of your photos at any time by emailing the same address, we will stop using them for marketing purposes within a reasonable time.</p>
 </div>

 <!-- 9. DISCLOSURE -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">9. Disclosure of personal information</h2>
 <p class="mb-3">We may disclose your personal information to:</p>
 <div class="overflow-x-auto mb-3">
 <table class="w-full text-sm border-collapse">
 <thead>
 <tr class="border-b-2 border-primary text-primary">
 <th class="text-left py-2 pr-4">Recipient</th>
 <th class="text-left py-2 pr-4">Purpose</th>
 <th class="text-left py-2">Country</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-surface-container">
 <tr><td class="py-2 pr-4 font-semibold">Our technicians</td><td class="py-2 pr-4">Perform the work</td><td class="py-2">Australia</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Stripe</td><td class="py-2 pr-4">Payment processing</td><td class="py-2">United States</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Google Workspace</td><td class="py-2 pr-4">Email + document storage</td><td class="py-2">USA (with EU/AU centres)</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">GoHighLevel / LeadConnector</td><td class="py-2 pr-4">CRM, scheduling</td><td class="py-2">United States</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Mailgun</td><td class="py-2 pr-4">Email delivery</td><td class="py-2">United States</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Twilio</td><td class="py-2 pr-4">SMS delivery (Phase 1B)</td><td class="py-2">USA (AU phone number)</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Cloudinary</td><td class="py-2 pr-4">Photo storage and processing</td><td class="py-2">USA / EU</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Google Analytics 4 / Ads</td><td class="py-2 pr-4">Analytics + ad attribution</td><td class="py-2">United States</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Slack</td><td class="py-2 pr-4">Internal team coordination</td><td class="py-2">United States</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Government / regulators</td><td class="py-2 pr-4">Where required by law</td><td class="py-2">Australia</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Insurance providers</td><td class="py-2 pr-4">In the event of a claim</td><td class="py-2">Australia</td></tr>
 <tr><td class="py-2 pr-4 font-semibold">Professional advisers</td><td class="py-2 pr-4">Accountants, lawyers</td><td class="py-2">Australia</td></tr>
 </tbody>
 </table>
 </div>
 <p class="mb-3">We do <strong>not</strong> sell, rent, or trade your personal information to third parties for their marketing purposes.</p>
 <p>By submitting personal information to us, you consent to these disclosures, including transfer outside Australia (see &sect; 10).</p>
 </div>

 <!-- 10. OVERSEAS -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">10. Overseas disclosure (APP 8)</h2>
 <p class="mb-3">Several of our service providers are located outside Australia, primarily in the United States, with some operations in the European Union.</p>
 <p class="mb-3">When we disclose personal information overseas, we take reasonable steps to ensure the recipient handles your information in a manner consistent with the APPs:</p>
 <ul class="list-disc pl-6 space-y-2 mb-3">
 <li>Using providers with public privacy policies and security certifications (SOC 2, ISO 27001, PCI-DSS where applicable)</li>
 <li>Reviewing each provider&rsquo;s data-handling representations before engagement</li>
 <li>Limiting the personal information shared to what is necessary for the service</li>
 </ul>
 <p class="mb-3">The privacy laws of the United States and the European Union differ from Australian privacy law. By consenting to the disclosures listed in &sect; 9, you accept that the protections available under the Australian Privacy Act may not apply once your information leaves Australia, and we may not be accountable for an overseas recipient&rsquo;s act or practice that breaches the APPs (in accordance with section 16C of the Privacy Act 1988).</p>
 <p>If you do not want your information processed overseas, please contact us <strong>before</strong> submitting it. We may not be able to provide our quote or services without it, but we will tell you so honestly.</p>
 </div>

 <!-- 11. SECURITY -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">11. Data security (APP 11)</h2>
 <p class="mb-3">We take reasonable steps to protect personal information from misuse, interference, loss, unauthorised access, modification, or disclosure:</p>
 <ul class="list-disc pl-6 space-y-2 mb-3">
 <li>Encrypted data transmission (HTTPS/TLS) on our website, forms, and admin tools</li>
 <li>Access controls limiting who can view customer data (each technician sees only their own job briefs)</li>
 <li>Use of reputable third-party platforms with their own security certifications</li>
 <li>Photos stored on Cloudinary with access controls</li>
 <li>Two-factor authentication on admin accounts</li>
 <li>Regular review of who has access and removal when access is no longer needed</li>
 </ul>
 <p>However, no internet-based service can be guaranteed 100% secure. You acknowledge that you provide personal information to us at your own risk.</p>
 </div>

 <!-- 12. NDB -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">12. Notifiable data breaches</h2>
 <p class="mb-2">If we become aware of a data breach that is likely to result in <strong>serious harm</strong>, we will:</p>
 <ol class="list-decimal pl-6 space-y-1">
 <li>Investigate and contain the breach as quickly as reasonably possible</li>
 <li>Notify the affected individuals as soon as practicable</li>
 <li>Notify the Office of the Australian Information Commissioner (OAIC) within the timeframes required under the Notifiable Data Breaches scheme</li>
 </ol>
 </div>

 <!-- 13. RIGHTS -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">13. Access, correction, and deletion</h2>
 <p class="mb-2">You have the right to:</p>
 <ul class="list-disc pl-6 space-y-2 mb-3">
 <li><strong>Access</strong> the personal information we hold about you</li>
 <li><strong>Request correction</strong> of inaccurate or out-of-date information</li>
 <li><strong>Request deletion</strong> of personal information we hold (subject to legal obligations to retain certain records, for example, tax invoices must be kept for at least 5 years per ATO requirements, and warranty records for the warranty period plus 7 years)</li>
 <li><strong>Withdraw consent</strong> for marketing communications at any time</li>
 <li><strong>Make a complaint</strong> at any time, with us or directly with the OAIC (see &sect; 17)</li>
 </ul>
 <p class="mb-3">To exercise these rights, contact us at <a href="mailto:support@timelessresurfacing.com.au" class="text-primary underline">support@timelessresurfacing.com.au</a>. We aim to respond within a reasonable time, generally within 30 calendar days. For unusually complex or large requests, the response may take longer; we will let you know in advance and keep you updated.</p>
 <p class="mb-3">We may need to verify your identity before granting access, making changes, or deleting data, this is to protect you from someone else impersonating you.</p>
 <p>There is <strong>no charge</strong> for normal access or correction. We may charge a reasonable cost-recovery fee for unusually complex or large access requests, but only after notifying you of the expected cost in advance and giving you the option to refine the scope.</p>
 </div>

 <!-- 14. MARKETING -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">14. Marketing communications (Spam Act 2003)</h2>
 <p class="mb-3">We may, <strong>with your express consent</strong>, send you marketing communications about our services, special offers, seasonal maintenance reminders, or new service offerings.</p>
 <p class="mb-2">You can opt out at any time:</p>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li><strong>SMS:</strong> reply STOP</li>
 <li><strong>Email:</strong> click the unsubscribe link</li>
 <li><strong>In writing:</strong> email <a href="mailto:support@timelessresurfacing.com.au" class="text-primary underline">support@timelessresurfacing.com.au</a></li>
 </ul>
 <p class="mb-3">Opting out of marketing does <strong>not</strong> affect our ability to send you transactional messages related to a service you have engaged us for. These are sent under &ldquo;ongoing business relationship&rdquo; inferred consent per the Spam Act 2003.</p>
 <p>We do <strong>not</strong> purchase, harvest, or use lists of contact details that have not given consent to receive marketing from us.</p>
 </div>

 <!-- 15. COOKIES -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">15. Cookies and website analytics</h2>
 <p class="mb-3">Our website uses cookies and <strong>Google Analytics 4</strong> (and, when our Google Ads campaigns are running, Google Ads conversion tracking and remarketing) to:</p>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li>Remember your preferences (e.g. cookie-consent choice)</li>
 <li>Measure how customers use our website</li>
 <li>Improve site performance and content</li>
 <li>Attribute leads to advertising sources (where consented)</li>
 </ul>
 <p class="mb-3">You can disable cookies via your browser settings. Some site features may not work correctly if cookies are disabled.</p>
 <p>You can opt out of Google&rsquo;s personalised advertising via Google&rsquo;s Ad Settings: <a href="https://adssettings.google.com" rel="noopener" target="_blank" class="text-primary underline">https://adssettings.google.com</a></p>
 </div>

 <!-- 16. CHILDREN -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">16. Children</h2>
 <p class="mb-3">Our services are directed at property owners, property managers, builders, and tenants, generally adults. We do <strong>not</strong> knowingly collect personal information from individuals under 18.</p>
 <p>If you believe we have collected information from a child without parental consent, please contact us at <a href="mailto:support@timelessresurfacing.com.au" class="text-primary underline">support@timelessresurfacing.com.au</a> and we will delete it.</p>
 </div>

 <!-- 17. COMPLAINTS -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">17. Complaints</h2>
 <p class="mb-3">If you believe we have breached your privacy or this Privacy Policy, you may contact us:</p>
 <div class="bg-white border border-surface-container rounded-xl p-6 space-y-3 mb-3">
 <p class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-primary" aria-hidden="true">mail</span> <a href="mailto:support@timelessresurfacing.com.au" class="text-primary underline font-medium">support@timelessresurfacing.com.au</a></p>
 <p class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-primary" aria-hidden="true">call</span> <a href="tel:<?php echo timeless_phone_link(); ?>" class="text-primary underline font-medium"><?php echo timeless_phone(); ?></a></p>
 <p class="flex items-center gap-2"><span class="material-symbols-outlined text-base text-primary" aria-hidden="true">location_on</span> Timeless Resurfacing, 87 Woodlands Road, Liverpool NSW 2170</p>
 </div>
 <p class="mb-3">We will acknowledge your complaint promptly and aim to respond substantively within a reasonable time, generally within 30 calendar days.</p>
 <p class="mb-3">You may also lodge a complaint <strong>directly</strong> with the <strong>Office of the Australian Information Commissioner (OAIC)</strong>, you do not have to contact us first:</p>
 <div class="bg-surface-container border border-surface-container rounded-xl p-4 space-y-2 text-sm">
 <p><strong>Website:</strong> <a href="https://www.oaic.gov.au" class="text-primary underline" rel="noopener" target="_blank">https://www.oaic.gov.au</a></p>
 <p><strong>Phone:</strong> 1300 363 992</p>
 <p><strong>Post:</strong> GPO Box 5288, Sydney NSW 2001</p>
 </div>
 </div>

 <!-- 18. CHANGES -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">18. Changes to this Privacy Policy</h2>
 <p class="mb-3">We may update this Privacy Policy from time to time to reflect changes in our practices, our service providers, or the law. The &ldquo;Last updated&rdquo; date at the top indicates when the most recent change was made.</p>
 <p class="mb-2">For <strong>material changes</strong> (e.g. new categories of personal information collected, new offshore processors, change in how we handle photos), we will notify you by:</p>
 <ul class="list-disc pl-6 space-y-1 mb-3">
 <li>Updating the website</li>
 <li>Sending an email to active customers</li>
 <li>Where appropriate, an in-line notice on the quote form before you submit</li>
 </ul>
 <p>We encourage you to review this Privacy Policy periodically.</p>
 </div>

 <!-- 19. BUSINESS SALE -->
 <div class="reveal">
 <h2 class="text-xl font-bold text-primary mb-3">19. If our business is sold or restructured</h2>
 <p class="mb-3">If our business is sold, transferred, restructured, merged, or wound up, your personal information may be transferred to the new owner or assignee. Where reasonably practicable, the transfer will be subject to a privacy policy at least as protective as this one, or with your consent, or as otherwise permitted or required by law.</p>
 <p>We will notify active customers of any such transfer by email and on our website before the transfer takes effect, or as soon as reasonably practicable thereafter.</p>
 </div>

 </div>
 </div>
</section>

<?php get_footer(); ?>
