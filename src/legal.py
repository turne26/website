"""Privacy policy, terms and 404. Text carried over from the current turne.in pages.
Unfilled values are wrapped in <mark class="placeholder"> so they're easy to find (search: [ ] ).
"""
from pages import page
from layout import crumbs


def ph(s):
    return f'<mark class="placeholder">[{s}]</mark>'


ENTITY = ph("LEGAL ENTITY NAME")
ADDRESS = ph("REGISTERED ADDRESS")
UPDATED = ph("DATE")


def legal_page(slug, crumb, h1, title, desc, toc, intro, body):
    toc_html = "".join(f'<li><a href="#{i}">{t}</a></li>' for i, t in toc)
    page(
        slug=slug, crumb=crumb, og="home", title=title, desc=desc,
        body=f"""
<section class="page-hero" data-hero>
  <div class="wrap">
    {crumbs(crumb)}
    <h1 style="font-size:clamp(2.16rem,5.6vw,4.08rem)">{h1}</h1>
    <p class="updated">Last updated: {UPDATED}</p>
  </div>
</section>
<section class="band band--tight" style="padding-top:0">
  <div class="wrap legal">
    <nav aria-label="On this page"><p>On this page</p><ol>{toc_html}</ol></nav>
    <article>
      {intro}
      {body}
    </article>
  </div>
</section>
""",
    )


# ---------------------------------------------------------------- PRIVACY
legal_page(
    "privacy", "Privacy policy", "Privacy policy",
    "Privacy Policy | Turne",
    "How Turne collects, uses and protects your personal information when you join the waitlist, including WhatsApp consent, data sharing and your rights.",
    [("p1", "1. What we collect"), ("p2", "2. How we use it"), ("p3", "3. WhatsApp consent"), ("p4", "4. Who we share with"),
     ("p5", "5. How long we keep it"), ("p6", "6. Security"), ("p7", "7. Your rights"), ("p8", "8. Children"),
     ("p9", "9. Cookies and analytics"), ("p10", "10. Changes"), ("p11", "11. Contact")],
    f"""<p>This Privacy Policy explains how <strong>{ENTITY}</strong> ("Turne", "we", "us") collects, uses and protects your information when you join the Turne waitlist at turne.in.</p>
<p>By joining the waitlist you agree to this policy. If you do not agree, please do not submit your details.</p>""",
    f"""
<h2 id="p1">1. What we collect</h2>
<p>We deliberately ask for as little as possible. To join the waitlist we collect:</p>
<div class="table-wrap"><table>
<thead><tr><th scope="col">Data</th><th scope="col">Why we need it</th></tr></thead>
<tbody>
<tr><td>WhatsApp number</td><td>To verify you are a real person, prevent duplicate entries, and send you launch updates about your waitlist spot.</td></tr>
<tr><td>Full name</td><td>To identify your waitlist entry and address you correctly.</td></tr>
<tr><td>Date of birth</td><td>To confirm eligibility for age-restricted giveaways and experiences.</td></tr>
<tr><td>City</td><td>To plan our city-by-city rollout and show you relevant experiences.</td></tr>
</tbody></table></div>
<p>We also automatically record limited technical information: your IP address (for security and rate limiting), the approximate time you registered, and marketing attribution parameters (UTM source, medium, campaign and content) if you arrived through a campaign link.</p>
<p><strong>We do not collect</strong> your payment details, your contact list, your WhatsApp message history, or any information from your device beyond what is described above.</p>

<h2 id="p2">2. How we use your information</h2>
<ul>
<li>To verify your WhatsApp number by one-time password (OTP).</li>
<li>To create and maintain your waitlist entry and position.</li>
<li>To determine whether you qualify for Lifetime Premium as one of the first 10,000 verified members.</li>
<li>To send you WhatsApp messages about the Turne launch, your waitlist spot and your Premium status.</li>
<li>To understand, in aggregate, which marketing channels bring people to Turne.</li>
<li>To detect and prevent spam, abuse and fraudulent registrations.</li>
</ul>
<p>We do <strong>not</strong> sell your personal information, and we do not share your phone number with brands or advertisers.</p>

<h2 id="p3">3. WhatsApp communication consent</h2>
<p>When you submit your number you are consenting to receive WhatsApp messages from Turne relating to your waitlist registration and our launch. These are service and launch messages, not third-party advertising.</p>
<p>You can withdraw consent at any time by replying <strong>STOP</strong> to any message from us, or by emailing privacy@turne.in. Withdrawing consent may mean we can no longer keep your waitlist entry or Premium eligibility active.</p>

<h2 id="p4">4. Who we share data with</h2>
<p>We share your information only with service providers who help us operate Turne, and only to the extent they need it:</p>
<ul>
<li><strong>Our WhatsApp messaging provider</strong> receives your phone number in order to deliver your one-time password and launch messages.</li>
<li><strong>Our hosting and database provider</strong> stores your waitlist record.</li>
<li><strong>Our analytics provider</strong> receives anonymised or pseudonymised usage events, not your name or phone number.</li>
</ul>
<p>We may also disclose information where we are legally required to do so, or where it is necessary to protect our rights, safety or property.</p>

<h2 id="p5">5. How long we keep it</h2>
<p>We keep your waitlist record for as long as your entry is active, and afterwards for as long as reasonably necessary to honour your Lifetime Premium eligibility or to comply with our legal obligations. One-time password records are deleted within {ph("7")} days. You can ask us to delete your record at any time.</p>

<h2 id="p6">6. Security</h2>
<p>Your data is transmitted over HTTPS. One-time passwords are stored only as cryptographic hashes and are never readable by us or by anyone else. Access to our database is restricted, and we apply rate limiting plus attempt and resend limits to resist abuse. No system is perfectly secure, but we take these safeguards seriously.</p>

<h2 id="p7">7. Your rights</h2>
<p>You may ask us to:</p>
<ul>
<li>Tell you what personal information we hold about you.</li>
<li>Correct information that is inaccurate or out of date.</li>
<li>Delete your waitlist entry and associated personal information.</li>
<li>Withdraw your consent to WhatsApp communication.</li>
</ul>
<p>Email privacy@turne.in from the address or number associated with your entry and we will respond within {ph("30")} days.</p>

<h2 id="p8">8. Children</h2>
<p>Turne is not directed at children under {ph("13")}. If you believe a child has registered, contact us and we will remove the entry.</p>

<h2 id="p9">9. Cookies and analytics</h2>
<p>This website does not use advertising cookies. If analytics are enabled, our provider may set a first-party cookie or use local storage to count visits and measure how people move through the registration flow. Campaign parameters from your link are stored in your browser session so that attribution survives a page refresh.</p>

<h2 id="p10">10. Changes</h2>
<p>We may update this policy as Turne develops. When we do, we will change the "last updated" date above. Material changes will be communicated to waitlist members.</p>

<h2 id="p11">11. Contact</h2>
<p><strong>{ENTITY}</strong><br>{ADDRESS}<br>Email: privacy@turne.in</p>
""",
)

# ---------------------------------------------------------------- TERMS
legal_page(
    "terms", "Terms and conditions", "Terms and conditions",
    "Terms and Conditions | Turne Waitlist, Premium and Giveaways",
    "Terms for the Turne waitlist, Lifetime Premium membership and giveaways, including eligibility, the 50/50 allocation, prizes and governing law.",
    [("part-a", "Part A: Waitlist"), ("part-b", "Part B: Premium"), ("part-c", "Part C: Giveaways"), ("part-d", "Part D: General")],
    f"""<p>These terms govern your use of the Turne waitlist website operated by <strong>{ENTITY}</strong> ("Turne", "we", "us"). By joining the waitlist you accept these terms. Please also read our <a class="textlink" href="{{{{u:privacy}}}}">Privacy policy</a>.</p>""",
    f"""
<h2 id="part-a">Part A: Waitlist terms</h2>
<h3 id="a1">A1. What the waitlist is</h3>
<p>Turne is a digital event and brand engagement platform in pre-launch. The waitlist is a way to register your interest and secure early access. Joining the waitlist does not create an account on the Turne platform and does not oblige you to use Turne when it launches.</p>
<h3 id="a2">A2. Eligibility</h3>
<p>You must be at least {ph("13")} years old and hold a valid WhatsApp number to join. Some experiences and giveaways carry their own minimum age, which will be stated at the time.</p>
<h3 id="a3">A3. Verification and one entry per number</h3>
<p>Your registration is complete only once your WhatsApp number is verified by the one-time password we send you. Each WhatsApp number may hold one waitlist entry. Attempting to register the same number more than once will return your existing entry rather than creating a new one.</p>
<h3 id="a4">A4. Waitlist position</h3>
<p>Positions are assigned in the order that registrations are verified, continuing from our existing member count. Your position is final once assigned and cannot be transferred, sold or exchanged.</p>
<h3 id="a5">A5. Conduct</h3>
<p>You agree not to submit false information, register numbers you do not control, use automated tools or scripts to register, or otherwise attempt to manipulate waitlist positions or Premium allocation. We may remove any entry that breaches this clause, without notice.</p>
<h3 id="a6">A6. Launch timing</h3>
<p>The countdown on our website shows our <em>planned</em> launch timeline. Launch dates for pre-launch products move. We may change the launch date, and doing so does not entitle you to any compensation.</p>

<h2 id="part-b">Part B: Premium membership terms</h2>
<h3 id="b1">B1. The first-10,000 offer</h3>
<p>The first 10,000 verified waitlist members qualify for Turne <strong>Lifetime Premium</strong> membership at no cost. Qualification is determined by verified registration order and is allocated automatically by our systems. Once 10,000 spots are allocated, the offer closes.</p>
<h3 id="b2">B2. What "Lifetime" means</h3>
<p>"Lifetime" means for as long as Turne operates the Premium membership tier and your membership remains in good standing. It does not mean any specific number of years, and it does not survive the discontinuation of the Turne service.</p>
<h3 id="b3">B3. Premium benefits may evolve</h3>
<p>Premium benefits are not finalised. We describe the current intended benefits on our website, and they may change, expand or be replaced as Turne develops. We will not reduce the core Premium entitlement without telling members.</p>
<p>Currently intended benefits include: access to the Premium allocation of selected giveaway opportunities, early access to selected experiences, and priority on new opportunities as they are introduced. Nothing in this list is a guarantee of a specific feature at a specific time.</p>
<h3 id="b4">B4. Not transferable</h3>
<p>Premium membership is personal to you and tied to your verified WhatsApp number. It cannot be sold, gifted or transferred.</p>
<h3 id="b5">B5. Withdrawal for abuse</h3>
<p>We may suspend or withdraw Premium membership where we reasonably believe it was obtained through fraud, automation, duplicate registration or other abuse of these terms.</p>

<h2 id="part-c">Part C: Giveaway terms</h2>
<h3 id="c1">C1. Giveaways are a participation mechanic, not gambling</h3>
<p>Turne giveaways are free to enter for eligible members. There is no purchase requirement, no stake, no wager and no consideration of any kind required to enter. Turne is not a gambling, betting or gaming-for-money platform.</p>
<h3 id="c2">C2. The 50/50 allocation</h3>
<p>For eligible giveaways, giveaway opportunities are allocated as follows: <strong>50% to the normal-member share and 50% to the Premium-member share</strong>. Winners are drawn within each share.</p>
<p><strong>Premium does not guarantee that you will win anything.</strong> It provides access to the Premium share of selected giveaway opportunities. Your chance of winning depends on how many people enter that share.</p>
<p>Not every giveaway will use this split. Where a giveaway has different allocation rules, those rules will be stated on the giveaway itself and will take precedence over this clause.</p>
<h3 id="c3">C3. Per-giveaway rules</h3>
<p>Each giveaway may set its own entry window, eligibility criteria (including minimum age, city or verification requirements), entry method, number of prizes and draw date. These specific rules are published with the giveaway and form part of these terms for that giveaway.</p>
<h3 id="c4">C4. Prizes</h3>
<p>Prizes may include physical products, event tickets, discount coupons, digital products, memberships, experiences and other brand rewards. Prizes are as described at the time of the giveaway, are not exchangeable for cash unless expressly stated, and may be substituted for a prize of equal or greater value where the original becomes unavailable.</p>
<h3 id="c5">C5. Winner selection and notification</h3>
<p>Unless a giveaway states otherwise, winners are selected at random from valid entries within the applicable share. We will notify winners on the WhatsApp number associated with their account. If a winner does not respond within {ph("7")} days, or cannot accept the prize, we may redraw.</p>
<h3 id="c6">C6. Disqualification</h3>
<p>We may disqualify entries that use multiple accounts, false details, automation, or any method designed to gain an unfair advantage.</p>
<h3 id="c7">C7. Brands shown on our website</h3>
<p>Any brand names, logos or campaigns shown in our website mockups and previews are illustrative examples only. They do not indicate a partnership, sponsorship or endorsement unless we have expressly announced one.</p>
<h3 id="c8">C8. Taxes</h3>
<p>Winners are responsible for any taxes arising from a prize, except where we are required by law to deduct tax at source, in which case we will do so and inform the winner.</p>

<h2 id="part-d">Part D: General</h2>
<h3 id="d1">D1. Our intellectual property</h3>
<p>The Turne name, logo, website design and content belong to us. You may not copy, reproduce or use them commercially without our written permission.</p>
<h3 id="d2">D2. Availability</h3>
<p>We provide this website "as is". We do not promise it will be uninterrupted or error-free, and we may change or withdraw it at any time.</p>
<h3 id="d3">D3. Limitation of liability</h3>
<p>To the fullest extent permitted by law, we are not liable for indirect or consequential loss arising from your use of this website or the waitlist. Nothing in these terms excludes liability that cannot lawfully be excluded, including liability for fraud or for death or personal injury caused by negligence.</p>
<h3 id="d4">D4. Changes to these terms</h3>
<p>We may update these terms as Turne develops. The "last updated" date above will change, and material changes will be communicated to waitlist members.</p>
<h3 id="d5">D5. Governing law</h3>
<p>These terms are governed by the laws of India, and the courts at {ph("CITY")}, India have exclusive jurisdiction over any dispute.</p>
<h3 id="d6">D6. Contact</h3>
<p><strong>{ENTITY}</strong><br>{ADDRESS}<br>Email: hello@turne.in</p>
""",
)

# ---------------------------------------------------------------- 404
page(
    slug="404", crumb="Page not found", og="home", noindex=True, no_sticky=True, out="404.html",
    title="Page Not Found | Turne",
    desc="This page doesn't exist. Head back to Turne or join the waitlist.",
    body="""
<section class="band lost" data-hero>
  <div class="wrap stack-lg">
    <h1>Wrong turn.</h1>
    <p class="lede">This page doesn't exist, or it moved. The good stuff is this way.</p>
    <div class="cta-row"><a class="btn btn--ticket" href="{{u:join}}">Join the waitlist</a><a class="textlink" href="{{u:}}">Back to home</a></div>
  </div>
</section>
""",
)
