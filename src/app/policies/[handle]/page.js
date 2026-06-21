import { notFound } from "next/navigation";
import { getShopPolicies, getShopInfo } from "@/utils/shopify";
import { ShieldCheck, ArrowRight, Undo2, Lock, FileText, Truck, Mail, Scale } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  return [
    { handle: 'refund-policy' },
    { handle: 'privacy-policy' },
    { handle: 'terms-of-service' },
    { handle: 'shipping-policy' },
    { handle: 'contact-information' },
    { handle: 'legal-notice' },
  ];
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { handle } = params;
  
  const titles = {
    "refund-policy": "Return & Refund Policy",
    "privacy-policy": "Privacy Policy",
    "terms-of-service": "Terms of Service",
    "shipping-policy": "Shipping Policy",
    "contact-information": "Contact Information",
    "legal-notice": "Legal Notice"
  };

  return {
    title: `${titles[handle] || 'Policy'} - Peteora`,
  };
}

export default async function PolicyPage(props) {
  const params = await props.params;
  const { handle } = params;
  const policies = await getShopPolicies();
  const shopInfo = await getShopInfo();

  let policyData = null;
  let customFallback = false;

  if (handle === "refund-policy") {
    customFallback = true;
    policyData = {
      title: "Return and Refund Policy",
      body: `
        <p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p>
        <p>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>
        <p>To start a return, you can contact us at <a href="mailto:shoppingmaniaglobalstore@gmail.com">shoppingmaniaglobalstore@gmail.com</a>. Please note that returns will need to be sent to the following address: 8401 Mayland Dr #6445, Richmond, VA, 23294, United States</p>
        <p>If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.</p>
        <p>You can always contact us for any return question at <a href="mailto:shoppingmaniaglobalstore@gmail.com">shoppingmaniaglobalstore@gmail.com</a>.</p>
        <br>
        <h4>Damages and issues</h4>
        <p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>
        <br>
        <h4>Exceptions / non-returnable items</h4>
        <p>Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.</p>
        <p>Unfortunately, we cannot accept returns on sale items or gift cards.</p>
        <br>
        <h4>Exchanges</h4>
        <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>
        <br>
        <h4>Refunds</h4>
        <p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>
        <p>If more than 15 business days have passed since we’ve approved your return, please contact us at <a href="mailto:shoppingmaniaglobalstore@gmail.com">shoppingmaniaglobalstore@gmail.com</a>.</p>
      `
    };
  } else if (handle === "privacy-policy") {
    policyData = policies?.privacyPolicy;
  } else if (handle === "terms-of-service") {
    customFallback = true;
    policyData = {
      title: "Terms of Service",
      body: `
        <h4>OVERVIEW</h4>
        <p>Welcome to Peteora! The terms "we", "us" and "our" refer to Peteora. Peteora operates this store and website, including all related information, content, features, tools, products and services in order to provide you, the customer, with a curated shopping experience (the "Services"). Peteora is powered by Shopify, which enables us to provide the Services to you.</p>
        <p>The below terms and conditions, together with any policies referenced herein (these "Terms of Service" or "Terms") describe your rights and responsibilities when you use the Services.</p>
        <p>Please read these Terms of Service carefully, as they include important information about your legal rights and cover areas such as warranty disclaimers and limitations of liability.</p>
        <p>By visiting, interacting with or using our Services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these Terms of Service or Privacy Policy, you should not use or access our Services.</p>
        <br>
        <h4>SECTION 1 - ACCESS AND ACCOUNT</h4>
        <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, and you have given us your consent to allow any of your minor dependents to use the Services on devices you own, purchase or manage.</p>
        <p>To use the Services, including accessing or browsing our online stores or purchasing any of the products or services we offer, you may be asked to provide certain information, such as your email address, billing, payment, and shipping information. You represent and warrant that all the information you provide in our stores is correct, current and complete and that you have all rights necessary to provide this information.</p>
        <p>You are solely responsible for maintaining the security of your account credentials and for all of your account activity. You may not transfer, sell, assign, or license your account to any other person.</p>
        <br>
        <h4>SECTION 2 - OUR PRODUCTS</h4>
        <p>We have made every effort to provide an accurate representation of our products and services in our online stores. However, please note that colors or product appearance may differ from how they may appear on your screen due to the type of device you use to access the store and your device settings and configuration.</p>
        <p>We do not warrant that the appearance or quality of any products or services purchased by you will meet your expectations or be the same as depicted or rendered in our online stores.</p>
        <p>All descriptions of products are subject to change at any time without notice at our sole discretion. We reserve the right to discontinue any product at any time and may limit the quantities of any products that we offer to any person, geographic region or jurisdiction, on a case-by-case basis.</p>
        <br>
        <h4>SECTION 3 - ORDERS</h4>
        <p>When you place an order, you are making an offer to purchase. Peteora reserves the right to accept or decline your order for any reason at its discretion. Your order is not accepted until Peteora confirms acceptance. We must receive and process your payment before your order is accepted. Please review your order carefully before submitting, as Peteora may be unable to accommodate cancellation requests after an order is accepted. In the event that we do not accept, make a change to, or cancel an order, we will attempt to notify you by contacting the e‑mail, billing address, and/or phone number provided at the time the order was made.</p>
        <p>Your purchases are subject to return or exchange solely in accordance with our Refund Policy.</p>
        <p>You represent and warrant that your purchases are for your own personal or household use and not for commercial resale or export.</p>
        <br>
        <h4>SECTION 4 - PRICES AND BILLING</h4>
        <p>Prices, discounts and promotions are subject to change without notice. The price charged for a product or service will be the price in effect at the time the order is placed and will be set out in your order confirmation email. Unless otherwise expressly stated, posted prices do not include taxes, shipping, handling, customs or import charges.</p>
        <p>Prices posted in our online stores may be different from prices offered in physical stores or in online or other stores operated by third parties. We may offer, from time to time, promotions on the Services that may affect pricing and that are governed by terms and conditions separate from these Terms. If there is a conflict between the terms for a promotion and these Terms, the promotion terms will govern.</p>
        <p>You agree to provide current, complete and accurate purchase, payment and account information for all purchases made at our stores. You agree to promptly update your account and other information, including your email address, credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.</p>
        <p>You represent and warrant that (i) the credit card information you provide is true, correct, and complete, (ii) you are duly authorized to use such credit card for the purchase, (iii) charges incurred by you will be honored by your credit card company, and (iv) you will pay charges incurred by you at the posted prices, including shipping and handling charges and all applicable taxes, if any.</p>
        <br>
        <h4>SECTION 5 - SHIPPING AND DELIVERY</h4>
        <p>We are not liable for shipping and delivery delays. All delivery times are estimates only and are not guaranteed. We are not responsible for delays caused by shipping carriers, customs processing, or events outside our control. Once we transfer products to the carrier, title and risk of loss passes to you.</p>
        <br>
        <h4>SECTION 6 - INTELLECTUAL PROPERTY</h4>
        <p>Our Services, including but not limited to all trademarks, brands, text, displays, images, graphics, product reviews, video, and audio, and the design, selection, and arrangement thereof, are owned by Peteora, its affiliates or licensors and are protected by U.S. and foreign patent, copyright and other intellectual property laws.</p>
        <p>These Terms permit you to use the Services for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on the Services without our prior written consent. Except as expressly provided herein, nothing in these Terms grants or shall be construed as granting a license or other rights to you under any patent, trademark, copyright, or other intellectual property of Peteora, Shopify or any third party. Unauthorized use of the Services may be a violation of federal and state intellectual property laws. All rights not expressly granted herein are reserved by Peteora.</p>
        <p>Peteora's names, logos, product and service names, designs, and slogans are trademarks of Peteora or its affiliates or licensors. You must not use such trademarks without the prior written permission of Peteora. Shopify's name, logo, product and service names, designs and slogans are trademarks of Shopify. All other names, logos, product and service names, designs, and slogans on the Services are the trademarks of their respective owners.</p>
        <br>
        <h4>SECTION 7 - OPTIONAL TOOLS</h4>
        <p>You may be provided with access to customer tools offered by third parties as part of the Services, which we neither monitor nor have any control nor input.</p>
        <p>You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.</p>
        <p>Any use by you of the optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).</p>
        <p>We may also, in the future, offer new features through the Services (including the release of new tools and resources). Such new features shall also be deemed part of the Services and are subject to these Terms of Service.</p>
        <br>
        <h4>SECTION 8 - THIRD-PARTY LINKS</h4>
        <p>The Services may contain materials and hyperlinks to websites provided or operated by third parties (including any embedded third party functionality). We are not responsible for examining or evaluating the content or accuracy of any third-party materials or websites you choose to access. If you decide to leave the Services to access these materials or third party sites, you do so at your own risk.</p>
        <p>We are not liable for any harm or damages related to your access of any third-party websites, or your purchase or use of any products, services, resources, or content on any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products and services should be directed to the third-party.</p>
        <br>
        <h4>SECTION 9 - RELATIONSHIP WITH SHOPIFY</h4>
        <p>Peteora is powered by Shopify, which enables us to provide the Services to you. However, any sales and purchases you make in our Store are made directly with Peteora. By using the Services, you acknowledge and agree that Shopify is not responsible for any aspect of any sales between you and Peteora, including any injury, damage, or loss resulting from purchased products and services. You hereby expressly release Shopify and its affiliates from all claims, damages, and liabilities arising from or related to your purchases and transactions with Peteora.</p>
        <br>
        <h4>SECTION 10 - PRIVACY POLICY</h4>
        <p>All personal information we collect through the Services is subject to our Privacy Policy, and certain personal information may be subject to Shopify's Privacy Policy, which can be viewed. By using the Services, you acknowledge that you have read these privacy policies.</p>
        <p>Because the Services are hosted by Shopify, Shopify collects and processes personal information about your access to and use of the Services in order to provide and improve the Services for you. Information you submit to the Services will be transmitted to and shared with Shopify as well as third parties that may be located in other countries than where you reside, in order to provide services to you. Review our privacy policy for more details on how we, Shopify, and our partners use your personal information.</p>
        <br>
        <h4>SECTION 11 - FEEDBACK</h4>
        <p>If you submit, upload, post, email, or otherwise transmit any ideas, suggestions, feedback, reviews, proposals, plans, or other content (collectively, "Feedback"), you grant us a perpetual, worldwide, sublicensable, royalty-free license to use, reproduce, modify, publish, distribute and display such Feedback in any medium for any purpose, including for commercial use. We may, for example, use our rights under this license to operate, provide, evaluate, enhance, improve and promote the Services and to perform our obligations and exercise our rights under the Terms of Service.</p>
        <p>You also represent and warrant that: (i) you own or have all necessary rights to all Feedback; (ii) you have disclosed any compensation or incentives received in connection with your submission of Feedback; and (iii) your Feedback will comply with these Terms. We are and shall be under no obligation (1) to maintain your Feedback in confidence; (2) to pay compensation for your Feedback; or (3) to respond to your Feedback.</p>
        <p>We may, but have no obligation to, monitor, edit or remove Feedback that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.</p>
        <p>You agree that your Feedback will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your Feedback will not contain libelous or otherwise unlawful, abusive or obscene Feedback, or contain any computer virus or other malware that could in any way affect the operation of the Services or any related website. You may not use a false email address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any Feedback. You are solely responsible for any Feedback you make and its accuracy. We take no responsibility and assume no liability for any Feedback posted by you or any third-party.</p>
        <br>
        <h4>SECTION 12 - ERRORS, INACCURACIES AND OMISSIONS</h4>
        <p>Occasionally there may be information on or in the Services that contain typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information is inaccurate at any time without prior notice (including after you have submitted your order).</p>
        <br>
        <h4>SECTION 13 - PROHIBITED USES</h4>
        <p>You may access and use the Services for lawful purposes only. You may not access or use the Services, directly or indirectly: (a) for any unlawful or malicious purpose; (b) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (c) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (d) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or harm any of our employees or any other person; (e) to transmit false or misleading information; (f) to send, knowingly receive, upload, download, use, or re-use any material that does not comply with the these Terms; (g) to transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation; (h) to impersonate or attempt to impersonate any other person or entity; or (i) to engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which, as determined by us, may harm Peteora, Shopify or users of the Services, or expose them to liability.</p>
        <p>In addition, you agree not to: (a) upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Services; (b) reproduce, duplicate, copy, extract, sell, resell or exploit any portion of the Services; (c) collect or track the personal information of others; (d) spam, phish, pharm, or pretext the services; (e) use any robot, spider, scraping, data gathering and extraction tools, automatic devices or processes, AI tools (such as agentic AI) or automated or manual means to access the Services; or (f) interfere with, bypass, or circumvent the security or authorization features, robot exclusion headers, or other measures we employ to restrict access to the Services. We reserve the right to suspend, disable, or terminate your account at any time, without notice, if we determine that you have violated any part of these Terms.</p>
        <br>
        <h4>SECTION 14 - AGENTS</h4>
        <p>14.1 This section ("Agent Terms") applies if you use, allow, enable, or cause the deployment of an Agent to access, use, or interact with any Services. "Agent" means any software or service that takes autonomous or semi-autonomous action on behalf of, or at the instruction of, any person or entity and that can be executed on behalf of or using persons device, without direct supervision.</p>
        <p>14.2 No Agent may access, use, or interact with Services unless, at all times, it identifies itself and operates in strict accordance with the requirements in section 14.4 below. In addition, no Agent may access, use, or interact with Services if we have requested that the Agent refrain from accessing, using, or interacting with any service.</p>
        <p>14.3 We may limit, including by technical measures, whether and how any Agent accesses, uses, and interacts with Services.</p>
        <p>14.4 Agents must: (i) in all HTTP/HTTPS requests, identify that the request is from an Agent and disclose the name of the Agent by including the following in the request's user agent string: "Agent/[agent name]"; (ii) not conceal or obfuscate that any access, use, or interactions are from an Agent, such as by (a) mimicking human behavior and interaction patterns, or (b) completing or circumventing CAPTCHAs or measures intended to distinguish computer use from humans, (iii) respond truthfully to any question or prompt seeking to determine if interactions are coming from a human or a computer, (iv) not circumvent or otherwise avoid any measure intended to block, limit, modify, or control whether and how Agents access, use, or interact with the Services.</p>
        <br>
        <h4>SECTION 15 - TERMINATION</h4>
        <p>We may terminate this agreement or your access to the Services (or any part thereof) in our sole discretion at any time without notice, and you will remain liable for all amounts due up to and including the date of termination.</p>
        <p>The following sections will continue to apply following any termination: Intellectual Property, Feedback, Termination, Disclaimer of Warranties, Limitation of Liability, Indemnification, Severability, Waiver; Entire Agreement, Assignment, Governing Law, Privacy Policy, and any other provisions that by their nature should survive termination.</p>
        <br>
        <h4>SECTION 16 - DISCLAIMER OF WARRANTIES</h4>
        <p>The information presented on or through the Services is made available solely for general information purposes. We do not warrant the accuracy, completeness, or usefulness of this information. Any reliance you place on such information is strictly at your own risk. We disclaim all liability and responsibility arising from any reliance placed on such materials by you or any other visitor to the Services, or by anyone who may be informed of any of its contents.</p>
        <p>EXCEPT AS EXPRESSLY STATED BY Peteora, THE SERVICES AND ALL PRODUCTS OFFERED THROUGH THE SERVICES ARE PROVIDED 'AS IS' AND 'AS AVAILABLE' FOR YOUR USE, WITHOUT ANY REPRESENTATION, WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, MERCHANTABLE QUALITY, FITNESS FOR A PARTICULAR PURPOSE, DURABILITY, TITLE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE, REPRESENT OR WARRANT THAT YOUR USE OF THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE. SOME JURISDICTIONS LIMIT OR DO NOT ALLOW THE DISCLAIMER OF IMPLIED OR OTHER WARRANTIES SO THE ABOVE DISCLAIMER MAY NOT APPLY TO YOU.</p>
        <br>
        <h4>SECTION 17 - LIMITATION OF LIABILITY</h4>
        <p>TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO CASE SHALL Peteora, OUR PARTNERS, DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, SERVICE PROVIDERS OR LICENSORS, OR THOSE OF SHOPIFY AND ITS AFFILIATES, BE LIABLE FOR ANY INJURY, LOSS, CLAIM, OR ANY DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, SPECIAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND, INCLUDING, WITHOUT LIMITATION, LOST PROFITS, LOST REVENUE, LOST SAVINGS, LOSS OF DATA, REPLACEMENT COSTS, OR ANY SIMILAR DAMAGES, WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, ARISING FROM YOUR USE OF ANY OF THE SERVICES OR ANY PRODUCTS PROCURED USING THE SERVICES, OR FOR ANY OTHER CLAIM RELATED IN ANY WAY TO YOUR USE OF THE SERVICES OR ANY PRODUCT, INCLUDING, BUT NOT LIMITED TO, ANY ERRORS OR OMISSIONS IN ANY CONTENT, OR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SERVICES OR ANY CONTENT (OR PRODUCT) POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES, EVEN IF ADVISED OF THEIR POSSIBILITY.</p>
        <br>
        <h4>SECTION 18 - INDEMNIFICATION</h4>
        <p>You agree to indemnify, defend and hold harmless Peteora, Shopify, and our affiliates, partners, officers, directors, employees, agents, contractors, licensors, and service providers from any losses, damages, liabilities or claims, including reasonable attorneys' fees, payable to any third party due to or arising out of (1) your breach of these Terms of Service or the documents they incorporate by reference, (2) your violation of any law or the rights of a third party, or (3) your access to and use of the Services.</p>
        <p>We will notify you of any indemnifiable claim, provided that a failure to promptly notify will not relieve you of your obligations unless you are materially prejudiced. We may control the defense and settlement of such claim at your expense, including choice of counsel, but will not settle any claim requiring non-monetary obligations from you without your consent (not to be unreasonably withheld). You will cooperate in the defense of indemnified claims, including by providing relevant documents.</p>
        <br>
        <h4>SECTION 19 - SEVERABILITY</h4>
        <p>In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.</p>
        <br>
        <h4>SECTION 20 - WAIVER; ENTIRE AGREEMENT</h4>
        <p>The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.</p>
        <p>These Terms of Service and any policies or operating rules posted by us on this site or in respect to the Service constitutes the entire agreement and understanding between you and us and governs your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).</p>
        <p>Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.</p>
        <br>
        <h4>SECTION 21 - ASSIGNMENT</h4>
        <p>You may not delegate, transfer or assign this Agreement or any of your rights or obligations under these Terms without our prior written consent, and any such attempt will be null and void. We may transfer, assign, or delegate these Terms and our rights and obligations without consent or notice to you.</p>
        <br>
        <h4>SECTION 22 - GOVERNING LAW</h4>
        <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the federal and state or territorial courts in the jurisdiction where Peteora is headquartered. You and Peteora consent to venue and personal jurisdiction in such courts.</p>
        <br>
        <h4>SECTION 23 - HEADINGS</h4>
        <p>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
        <br>
        <h4>SECTION 24 - CHANGES TO TERMS OF SERVICE</h4>
        <p>You can review the most current version of the Terms of Service at any time on this page.</p>
        <p>We reserve the right, in our sole discretion, to update, change, or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. We will notify you of any material changes to these Terms in accordance with applicable law, and such changes will be effective on the date specified in the notice. Your continued use of or access to the Services following the posting of any changes to these Terms of Service constitutes acceptance of those changes.</p>
        <br>
        <h4>SECTION 25 - CONTACT INFORMATION</h4>
        <p>Questions about the Terms of Service should be sent to us at <a href="mailto:shoppingmaniaglobalstore@gmail.com">shoppingmaniaglobalstore@gmail.com</a>.</p>
      `
    };
  } else if (handle === "shipping-policy") {
    customFallback = true;
    policyData = {
      title: "Shipping Policy",
      body: `
        <p>Thank you for visiting and shopping at Peteora.com. The following are the terms and conditions that constitute our Shipping Policy.</p>
        <br>
        <h4>Domestic Shipping Policy</h4>
        <p><strong>Shipment Processing Time</strong></p>
        <p>All orders are processed within 1–5 business days. Orders are not shipped or delivered on weekends or holidays.</p>
        <p>If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in the shipment of your order, we will contact you via email or telephone.</p>
        <br>
        <p><strong>Shipping Rates & Delivery Estimates</strong></p>
        <p>Shipping charges for your order will be calculated and displayed at checkout. Below are our standard delivery estimates:</p>
        <div class="table-responsive my-3">
          <table class="table table-bordered border-light" style="max-width: 600px;">
            <thead class="table-light">
              <tr>
                <th>Shipping Method</th>
                <th>Estimated Delivery Time</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard Shipping</td>
                <td>3–5 business days</td>
                <td>Free over $50, or $5.99</td>
              </tr>
              <tr>
                <td>Expedited Shipping</td>
                <td>2 business days</td>
                <td>$12.99</td>
              </tr>
              <tr>
                <td>Overnight Shipping</td>
                <td>1 business day</td>
                <td>$24.99</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><em>Note: Overnight delivery is only available for orders with delivery addresses within the continental United States. Delivery delays can occasionally occur due to carrier issues or extreme weather.</em></p>
        <br>
        <p><strong>Shipment to P.O. Boxes or APO/FPO Addresses</strong></p>
        <p>Peteora.com ships to addresses within the U.S., U.S. Territories, and APO/FPO/DPO addresses.</p>
        <br>
        <p><strong>Shipment Confirmation & Order Tracking</strong></p>
        <p>You will receive a Shipment Confirmation email once your order has shipped, containing your tracking number(s). The tracking number will be active within 24-48 hours.</p>
        <br>
        <h4>International Shipping Policy</h4>
        <p>We currently do not ship outside the U.S.</p>
        <br>
        <h4>Customs, Duties, and Taxes</h4>
        <p>Peteora.com is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).</p>
        <br>
        <h4>Damages and Lost Packages</h4>
        <p>Peteora.com is liable for products damaged or lost during shipping. If you received your order damaged, or if your tracking shows delivered but you have not received it, please follow these steps:</p>
        <ul>
          <li>Contact our support team at <a href="mailto:shoppingmaniaglobalstore@gmail.com">shoppingmaniaglobalstore@gmail.com</a> within 7 days of the delivery date.</li>
          <li>Save all packaging materials and damaged goods before filing a claim.</li>
          <li>Include your order number and photos of the damage in your email.</li>
        </ul>
        <br>
        <h4>Returns Policy</h4>
        <p>Our Return & Refund Policy provides detailed information about options and procedures for returning your order. For more information, please visit our <a href="/policies/refund-policy">Returns Policy</a> page.</p>
        <br>
        <h4>Contact Us</h4>
        <p>If you have any questions about our Shipping Policy, please contact us at <a href="mailto:shoppingmaniaglobalstore@gmail.com">shoppingmaniaglobalstore@gmail.com</a>.</p>
      `
    };
  } else if (handle === "contact-information") {
    customFallback = true;
    policyData = {
      title: "Contact Information",
      body: `
        <p>If you have any questions, please contact us at:</p>
        <p><strong>Store Name:</strong> Peteora</p>
        <p><strong>Email:</strong> shoppingmaniaglobalstore@gmail.com</p>
        <p><strong>Phone:</strong> +15715166562</p>
        <p><strong>Address:</strong> 8401 Mayland Dr #6445, Richmond, VA, 23294, United States</p>
      `
    };
  } else if (handle === "legal-notice") {
    customFallback = true;
    policyData = {
      title: "Legal Notice",
      body: `
        <p><strong>Business Name:</strong> Shopping Mania Global Store (Single member LLC)</p>
        <p><strong>Store Name:</strong> Peteora</p>
        <p><strong>Address:</strong> 8401 Mayland Dr #6445, Richmond, VA, 23294, United States</p>
        <p>This store is operated by Shopping Mania Global Store.</p>
        <p>All content and trademarks belong to their respective owners.</p>
      `
    };
  }

  if (!policyData && !customFallback) {
    // If shopify doesn't return a policy, we show a generic fallback so the page doesn't crash
    policyData = {
      title: handle.replace('-', ' ').toUpperCase(),
      body: "<p>This policy has not been configured in the store admin yet.</p>"
    };
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom">
        <ShieldCheck className="text-forest-green" size={28} />
        <h2 className="font-heading fs-3 fw-bold mb-0 text-charcoal-dark">
          {policyData.title}
        </h2>
      </div>

      <div 
        className="policy-content font-body text-charcoal-dark"
        style={{ lineHeight: "1.8" }}
        dangerouslySetInnerHTML={{ __html: policyData.body }}
      />

      <div className="mt-5 pt-4 border-top">
        <Link href="/" className="btn btn-outline-forest-green d-inline-flex align-items-center gap-2 px-4 py-2 fw-bold">
          Return to Store <ArrowRight size={18} />
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .policy-content h1, .policy-content h2, .policy-content h3 {
          font-family: var(--font-heading);
          color: var(--charcoal-dark);
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .policy-content p {
          margin-bottom: 1.5rem;
          color: #4a5568;
        }
        .policy-content a {
          color: var(--forest-green);
          text-decoration: underline;
        }
        .policy-content ul, .policy-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .policy-content li {
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
      `}} />
    </>
  );
}
