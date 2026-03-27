// Auto-generated from content/learn/**/*.mdx — do not edit manually
// Run: npm run generate:learn

export interface LearnArticleSummary {
  slug: string
  product: string
  title: string
  description: string
  category: string
}

export const learnArticles: LearnArticleSummary[] = [
  {
    "slug": "accesskeys",
    "product": "pulse",
    "title": "Accesskey Values Are Unique",
    "description": "Ensure no two elements share the same accesskey value.",
    "category": "accessibility"
  },
  {
    "slug": "empty-heading",
    "product": "pulse",
    "title": "All Headings Have Content",
    "description": "Ensure heading elements are not empty.",
    "category": "accessibility"
  },
  {
    "slug": "paste-preventing-inputs",
    "product": "pulse",
    "title": "Allow Users to Paste into Input Fields",
    "description": "Do not block paste on input fields — it harms usability, accessibility, and security.",
    "category": "best-practices"
  },
  {
    "slug": "aria-valid-attr",
    "product": "pulse",
    "title": "ARIA Attributes Are Valid and Not Misspelled",
    "description": "Ensure all aria-* attributes are valid and correctly spelled.",
    "category": "accessibility"
  },
  {
    "slug": "aria-valid-attr-value",
    "product": "pulse",
    "title": "ARIA Attributes Have Valid Values",
    "description": "Ensure every ARIA attribute has a valid value for its type.",
    "category": "accessibility"
  },
  {
    "slug": "aria-conditional-attr",
    "product": "pulse",
    "title": "ARIA Attributes Match Element Roles",
    "description": "Ensure ARIA attributes are conditionally valid for the element's role.",
    "category": "accessibility"
  },
  {
    "slug": "aria-allowed-attr",
    "product": "pulse",
    "title": "ARIA Attributes Match Their Roles",
    "description": "Ensure every ARIA attribute is allowed on the element's role.",
    "category": "accessibility"
  },
  {
    "slug": "duplicate-id-aria",
    "product": "pulse",
    "title": "ARIA IDs Are Unique",
    "description": "Ensure IDs used in ARIA attributes are unique in the document.",
    "category": "accessibility"
  },
  {
    "slug": "aria-input-field-name",
    "product": "pulse",
    "title": "ARIA Input Fields Have Accessible Names",
    "description": "Ensure every ARIA input field has a discernible accessible name.",
    "category": "accessibility"
  },
  {
    "slug": "aria-meter-name",
    "product": "pulse",
    "title": "ARIA Meter Elements Have Accessible Names",
    "description": "Ensure elements with role=meter have accessible names.",
    "category": "accessibility"
  },
  {
    "slug": "aria-progressbar-name",
    "product": "pulse",
    "title": "ARIA Progressbar Elements Have Accessible Names",
    "description": "Ensure elements with role=progressbar have accessible names.",
    "category": "accessibility"
  },
  {
    "slug": "aria-roles",
    "product": "pulse",
    "title": "ARIA Role Values Are Valid",
    "description": "Ensure all role attribute values are valid WAI-ARIA roles.",
    "category": "accessibility"
  },
  {
    "slug": "aria-required-parent",
    "product": "pulse",
    "title": "ARIA Roles Are in Required Parent Elements",
    "description": "Ensure elements with ARIA roles are nested inside required parent roles.",
    "category": "accessibility"
  },
  {
    "slug": "aria-required-children",
    "product": "pulse",
    "title": "ARIA Roles Have Required Children",
    "description": "Ensure elements with ARIA roles contain the required child elements.",
    "category": "accessibility"
  },
  {
    "slug": "aria-toggle-field-name",
    "product": "pulse",
    "title": "ARIA Toggle Fields Have Accessible Names",
    "description": "Ensure ARIA toggle fields like checkboxes and switches have accessible names.",
    "category": "accessibility"
  },
  {
    "slug": "aria-tooltip-name",
    "product": "pulse",
    "title": "ARIA Tooltip Elements Have Accessible Names",
    "description": "Ensure elements with role=tooltip have accessible names.",
    "category": "accessibility"
  },
  {
    "slug": "aria-treeitem-name",
    "product": "pulse",
    "title": "ARIA Treeitem Elements Have Accessible Names",
    "description": "Ensure elements with role=treeitem have accessible names.",
    "category": "accessibility"
  },
  {
    "slug": "aria-hidden-body",
    "product": "pulse",
    "title": "aria-hidden Is Not on the Body",
    "description": "Ensure aria-hidden is not present on the document body.",
    "category": "accessibility"
  },
  {
    "slug": "total-byte-weight",
    "product": "pulse",
    "title": "Avoid Enormous Network Payloads",
    "description": "Keep total page weight low to ensure fast load times on all connection speeds.",
    "category": "performance"
  },
  {
    "slug": "layout-shifts",
    "product": "pulse",
    "title": "Avoid Large Layout Shifts",
    "description": "Prevent unexpected content movement to improve visual stability and Cumulative Layout Shift (CLS).",
    "category": "performance"
  },
  {
    "slug": "long-tasks",
    "product": "pulse",
    "title": "Avoid Long Main-Thread Tasks",
    "description": "Break up tasks longer than 50 ms so the browser can respond to user input without delay.",
    "category": "performance"
  },
  {
    "slug": "redirects",
    "product": "pulse",
    "title": "Avoid Multiple Page Redirects",
    "description": "Eliminate unnecessary redirects to reduce time to first byte and speed up page load.",
    "category": "performance"
  },
  {
    "slug": "non-composited-animations",
    "product": "pulse",
    "title": "Avoid Non-Composited Animations",
    "description": "Use compositor-friendly CSS properties for animations to prevent jank and keep frame rates smooth.",
    "category": "performance"
  },
  {
    "slug": "geolocation-on-start",
    "product": "pulse",
    "title": "Avoid Requesting Geolocation on Page Load",
    "description": "Do not request geolocation permission automatically — wait until the user takes a relevant action.",
    "category": "best-practices"
  },
  {
    "slug": "notification-on-start",
    "product": "pulse",
    "title": "Avoid Requesting Notification Permission on Page Load",
    "description": "Do not prompt users for notification permission until they express interest in receiving updates.",
    "category": "best-practices"
  },
  {
    "slug": "bf-cache",
    "product": "pulse",
    "title": "Back/Forward Cache Restoration",
    "description": "Ensure your pages are eligible for the browser's back/forward cache to enable instant navigation.",
    "category": "performance"
  },
  {
    "slug": "color-contrast",
    "product": "pulse",
    "title": "Background and Foreground Colors Have Sufficient Contrast",
    "description": "Ensure text has enough contrast against its background to be readable.",
    "category": "accessibility"
  },
  {
    "slug": "button-name",
    "product": "pulse",
    "title": "Buttons Have an Accessible Name",
    "description": "Ensure every button element has a discernible accessible name.",
    "category": "accessibility"
  },
  {
    "slug": "aria-command-name",
    "product": "pulse",
    "title": "Command Elements Have Accessible Names",
    "description": "Ensure elements with ARIA command roles have accessible names.",
    "category": "accessibility"
  },
  {
    "slug": "cumulative-layout-shift",
    "product": "pulse",
    "title": "Cumulative Layout Shift (CLS)",
    "description": "What CLS measures, how Lighthouse scores it, and how to improve it.",
    "category": "performance"
  },
  {
    "slug": "dlitem",
    "product": "pulse",
    "title": "Definition Items Are Wrapped in dl Elements",
    "description": "Ensure dt and dd elements are contained within a dl.",
    "category": "accessibility"
  },
  {
    "slug": "definition-list",
    "product": "pulse",
    "title": "Definition Lists Are Properly Structured",
    "description": "Ensure dl elements contain only dt, dd, div, template, or script groups.",
    "category": "accessibility"
  },
  {
    "slug": "aria-dialog-name",
    "product": "pulse",
    "title": "Dialog Elements Have Accessible Names",
    "description": "Ensure elements with role=dialog or role=alertdialog have accessible names.",
    "category": "accessibility"
  },
  {
    "slug": "image-aspect-ratio",
    "product": "pulse",
    "title": "Display Images with Correct Aspect Ratio",
    "description": "Ensure rendered images match their natural aspect ratio to prevent visual distortion.",
    "category": "best-practices"
  },
  {
    "slug": "meta-description",
    "product": "pulse",
    "title": "Document Has a Meta Description",
    "description": "Add a concise meta description to improve how your page appears in search results.",
    "category": "seo"
  },
  {
    "slug": "document-title",
    "product": "pulse",
    "title": "Document Has a Title Element",
    "description": "Ensure the HTML document has a non-empty title element.",
    "category": "accessibility"
  },
  {
    "slug": "hreflang",
    "product": "pulse",
    "title": "Document Has a Valid hreflang",
    "description": "Use correct hreflang annotations to serve the right language version to users in different regions.",
    "category": "seo"
  },
  {
    "slug": "canonical",
    "product": "pulse",
    "title": "Document Has a Valid rel=canonical",
    "description": "Set a canonical URL to prevent duplicate content issues and consolidate ranking signals.",
    "category": "seo"
  },
  {
    "slug": "document-latency-insight",
    "product": "pulse",
    "title": "Document Request Latency",
    "description": "Checks how long the server takes to respond with the main HTML document and flags slow responses.",
    "category": "performance"
  },
  {
    "slug": "duplicated-javascript-insight",
    "product": "pulse",
    "title": "Duplicated JavaScript",
    "description": "Detects JavaScript modules that are included more than once in your bundles, wasting bytes and parse time.",
    "category": "performance"
  },
  {
    "slug": "aria-prohibited-attr",
    "product": "pulse",
    "title": "Elements Use Only Permitted ARIA Attributes",
    "description": "Ensure elements don't use ARIA attributes that are prohibited for their role.",
    "category": "accessibility"
  },
  {
    "slug": "csp-xss",
    "product": "pulse",
    "title": "Ensure CSP Is Effective Against XSS Attacks",
    "description": "Deploy a Content Security Policy that blocks inline scripts and untrusted sources to prevent XSS.",
    "category": "best-practices"
  },
  {
    "slug": "origin-isolation",
    "product": "pulse",
    "title": "Ensure Proper Origin Isolation with COOP",
    "description": "Set the Cross-Origin-Opener-Policy header to isolate your browsing context from cross-origin windows.",
    "category": "best-practices"
  },
  {
    "slug": "first-contentful-paint",
    "product": "pulse",
    "title": "First Contentful Paint (FCP)",
    "description": "What FCP measures, how Lighthouse scores it, and how to improve it.",
    "category": "performance"
  },
  {
    "slug": "font-display-insight",
    "product": "pulse",
    "title": "Font Display",
    "description": "Checks whether custom fonts use font-display to avoid invisible text during loading.",
    "category": "performance"
  },
  {
    "slug": "forced-reflow-insight",
    "product": "pulse",
    "title": "Forced Reflow",
    "description": "Detects JavaScript that forces the browser to recalculate layout synchronously, causing jank and long tasks.",
    "category": "performance"
  },
  {
    "slug": "label",
    "product": "pulse",
    "title": "Form Elements Have Associated Labels",
    "description": "Ensure every form element has an associated label.",
    "category": "accessibility"
  },
  {
    "slug": "frame-title",
    "product": "pulse",
    "title": "Frames Have a Title",
    "description": "Ensure iframe and frame elements have a descriptive title attribute.",
    "category": "accessibility"
  },
  {
    "slug": "heading-order",
    "product": "pulse",
    "title": "Headings Appear in Sequential Order",
    "description": "Ensure heading levels do not skip (e.g., h1 to h3).",
    "category": "accessibility"
  },
  {
    "slug": "aria-hidden-focus",
    "product": "pulse",
    "title": "Hidden Elements Don't Contain Focusable Content",
    "description": "Ensure aria-hidden elements don't contain focusable interactive content.",
    "category": "accessibility"
  },
  {
    "slug": "html-has-lang",
    "product": "pulse",
    "title": "HTML Element Has a lang Attribute",
    "description": "Ensure the html element has a lang attribute.",
    "category": "accessibility"
  },
  {
    "slug": "html-xml-lang-mismatch",
    "product": "pulse",
    "title": "HTML lang and xml:lang Match",
    "description": "Ensure lang and xml:lang attributes on the html element have the same value.",
    "category": "accessibility"
  },
  {
    "slug": "html-lang-valid",
    "product": "pulse",
    "title": "HTML lang Attribute Is Valid",
    "description": "Ensure the html lang attribute uses a valid BCP 47 language tag.",
    "category": "accessibility"
  },
  {
    "slug": "image-alt",
    "product": "pulse",
    "title": "Image Elements Have Alt Attributes",
    "description": "Ensure every image element has an alt attribute.",
    "category": "accessibility"
  },
  {
    "slug": "unsized-images",
    "product": "pulse",
    "title": "Image Elements Need Explicit Width and Height",
    "description": "Set width and height attributes on images to prevent layout shifts when images load.",
    "category": "performance"
  },
  {
    "slug": "input-image-alt",
    "product": "pulse",
    "title": "Image Inputs Have Alt Text",
    "description": "Ensure input elements with type=image have alt attributes.",
    "category": "accessibility"
  },
  {
    "slug": "image-redundant-alt",
    "product": "pulse",
    "title": "Images Don't Have Redundant Alt Text",
    "description": "Ensure image alt text doesn't duplicate surrounding text content.",
    "category": "accessibility"
  },
  {
    "slug": "image-delivery-insight",
    "product": "pulse",
    "title": "Improve Image Delivery",
    "description": "Flags images that use outdated formats, are not properly sized, or lack compression.",
    "category": "performance"
  },
  {
    "slug": "inp-breakdown-insight",
    "product": "pulse",
    "title": "INP Breakdown",
    "description": "Breaks down the phases of Interaction to Next Paint to show where interaction delays originate.",
    "category": "performance"
  },
  {
    "slug": "input-button-name",
    "product": "pulse",
    "title": "Input Buttons Have Discernible Text",
    "description": "Ensure input elements with type=button, submit, or reset have accessible names.",
    "category": "accessibility"
  },
  {
    "slug": "interaction-to-next-paint",
    "product": "pulse",
    "title": "Interaction to Next Paint (INP)",
    "description": "What INP measures, how Lighthouse scores it, and how to improve it.",
    "category": "performance"
  },
  {
    "slug": "bootup-time",
    "product": "pulse",
    "title": "JavaScript Execution Time",
    "description": "Reduce the time the browser spends parsing, compiling, and executing JavaScript to improve responsiveness.",
    "category": "performance"
  },
  {
    "slug": "valid-lang",
    "product": "pulse",
    "title": "lang Attributes Have Valid Values",
    "description": "Ensure all elements with a lang attribute use valid BCP 47 tags.",
    "category": "accessibility"
  },
  {
    "slug": "largest-contentful-paint",
    "product": "pulse",
    "title": "Largest Contentful Paint (LCP)",
    "description": "What LCP measures, how Lighthouse scores it, and how to improve it.",
    "category": "performance"
  },
  {
    "slug": "cls-culprits-insight",
    "product": "pulse",
    "title": "Layout Shift Culprits",
    "description": "Identifies the DOM elements responsible for unexpected layout shifts during page load.",
    "category": "performance"
  },
  {
    "slug": "lcp-breakdown-insight",
    "product": "pulse",
    "title": "LCP Breakdown",
    "description": "Decomposes Largest Contentful Paint into sub-parts to pinpoint the slowest phase of your LCP element's load.",
    "category": "performance"
  },
  {
    "slug": "lcp-discovery-insight",
    "product": "pulse",
    "title": "LCP Request Discovery",
    "description": "Checks whether the browser can discover the LCP resource early enough to start downloading it without delay.",
    "category": "performance"
  },
  {
    "slug": "legacy-javascript-insight",
    "product": "pulse",
    "title": "Legacy JavaScript",
    "description": "Flags JavaScript bundles that ship polyfills and transpiled syntax unnecessary for modern browsers.",
    "category": "performance"
  },
  {
    "slug": "link-in-text-block",
    "product": "pulse",
    "title": "Links Are Distinguishable Without Color",
    "description": "Ensure links within text blocks are identifiable by more than color alone.",
    "category": "accessibility"
  },
  {
    "slug": "link-name",
    "product": "pulse",
    "title": "Links Have a Discernible Name",
    "description": "Ensure every anchor element has a discernible accessible name.",
    "category": "accessibility"
  },
  {
    "slug": "link-text",
    "product": "pulse",
    "title": "Links Have Descriptive Text",
    "description": "Use meaningful anchor text so users and search engines understand where each link leads.",
    "category": "seo"
  },
  {
    "slug": "listitem",
    "product": "pulse",
    "title": "List Items Are in Proper Parent Elements",
    "description": "Ensure li elements are contained within ul, ol, or menu.",
    "category": "accessibility"
  },
  {
    "slug": "list",
    "product": "pulse",
    "title": "Lists Contain Only Proper Elements",
    "description": "Ensure ul and ol elements only contain li, script, or template children.",
    "category": "accessibility"
  },
  {
    "slug": "max-potential-first-input-delay",
    "product": "pulse",
    "title": "Max Potential First Input Delay (Max Potential FID)",
    "description": "What Max Potential FID measures, how Lighthouse scores it, and how to improve it.",
    "category": "performance"
  },
  {
    "slug": "unminified-css",
    "product": "pulse",
    "title": "Minify CSS",
    "description": "Remove unnecessary characters from CSS files to reduce network payload and speed up page load.",
    "category": "performance"
  },
  {
    "slug": "unminified-javascript",
    "product": "pulse",
    "title": "Minify JavaScript",
    "description": "Remove unnecessary characters from JavaScript files to reduce transfer size and improve load performance.",
    "category": "performance"
  },
  {
    "slug": "mainthread-work-breakdown",
    "product": "pulse",
    "title": "Minimize Main-Thread Work",
    "description": "Reduce the total amount of work the browser's main thread performs during page load to improve responsiveness.",
    "category": "performance"
  },
  {
    "slug": "clickjacking-mitigation",
    "product": "pulse",
    "title": "Mitigate Clickjacking with XFO or CSP",
    "description": "Prevent your page from being embedded in malicious iframes by setting X-Frame-Options or CSP frame-ancestors.",
    "category": "best-practices"
  },
  {
    "slug": "modern-http-insight",
    "product": "pulse",
    "title": "Modern HTTP",
    "description": "Checks whether your server uses HTTP/2 or HTTP/3 to deliver resources efficiently.",
    "category": "performance"
  },
  {
    "slug": "network-dependency-tree-insight",
    "product": "pulse",
    "title": "Network Dependency Tree",
    "description": "Visualizes the critical request chain to identify resources that block page rendering.",
    "category": "performance"
  },
  {
    "slug": "aria-deprecated-role",
    "product": "pulse",
    "title": "No Deprecated ARIA Roles",
    "description": "Ensure elements don't use ARIA roles that have been deprecated.",
    "category": "accessibility"
  },
  {
    "slug": "tabindex",
    "product": "pulse",
    "title": "No Element Has tabindex Greater Than Zero",
    "description": "Ensure no element uses a positive tabindex value.",
    "category": "accessibility"
  },
  {
    "slug": "form-field-multiple-labels",
    "product": "pulse",
    "title": "No Form Fields Have Multiple Labels",
    "description": "Ensure form fields are not associated with more than one label element.",
    "category": "accessibility"
  },
  {
    "slug": "meta-refresh",
    "product": "pulse",
    "title": "No Meta Refresh Redirect",
    "description": "Ensure the page does not use a timed meta refresh redirect.",
    "category": "accessibility"
  },
  {
    "slug": "object-alt",
    "product": "pulse",
    "title": "Object Elements Have Alternate Text",
    "description": "Ensure object elements have text alternatives for accessibility.",
    "category": "accessibility"
  },
  {
    "slug": "dom-size-insight",
    "product": "pulse",
    "title": "Optimize DOM Size",
    "description": "Flags pages with an excessively large DOM tree that slows rendering, layout calculations, and memory usage.",
    "category": "performance"
  },
  {
    "slug": "viewport-insight",
    "product": "pulse",
    "title": "Optimize Viewport for Mobile",
    "description": "Checks whether your page has a properly configured viewport meta tag for mobile devices.",
    "category": "performance"
  },
  {
    "slug": "bypass",
    "product": "pulse",
    "title": "Page Has a Skip Link or Landmark",
    "description": "Ensure users can bypass repeated navigation blocks.",
    "category": "accessibility"
  },
  {
    "slug": "http-status-code",
    "product": "pulse",
    "title": "Page Has Successful HTTP Status Code",
    "description": "Verify your page returns a 2xx HTTP status code so search engines can index it.",
    "category": "seo"
  },
  {
    "slug": "doctype",
    "product": "pulse",
    "title": "Page Has the HTML Doctype",
    "description": "Include a DOCTYPE declaration to prevent the browser from falling into quirks mode.",
    "category": "best-practices"
  },
  {
    "slug": "is-crawlable",
    "product": "pulse",
    "title": "Page Isn't Blocked from Indexing",
    "description": "Ensure search engines can crawl and index your page by removing blocking directives.",
    "category": "seo"
  },
  {
    "slug": "charset",
    "product": "pulse",
    "title": "Properly Defines Charset",
    "description": "Declare a character encoding early in your HTML to ensure text renders correctly.",
    "category": "best-practices"
  },
  {
    "slug": "redirects-http",
    "product": "pulse",
    "title": "Redirects HTTP Traffic to HTTPS",
    "description": "Automatically redirect all HTTP requests to HTTPS to ensure encrypted connections.",
    "category": "best-practices"
  },
  {
    "slug": "server-response-time",
    "product": "pulse",
    "title": "Reduce Server Response Time (TTFB)",
    "description": "Minimize Time to First Byte so the browser can start rendering the page sooner.",
    "category": "performance"
  },
  {
    "slug": "unused-css-rules",
    "product": "pulse",
    "title": "Reduce Unused CSS",
    "description": "Remove CSS rules that are never applied to reduce render-blocking payload and speed up first paint.",
    "category": "performance"
  },
  {
    "slug": "unused-javascript",
    "product": "pulse",
    "title": "Reduce Unused JavaScript",
    "description": "Remove JavaScript that is downloaded but never executed to cut load time and reduce main-thread work.",
    "category": "performance"
  },
  {
    "slug": "render-blocking-insight",
    "product": "pulse",
    "title": "Render Blocking Requests",
    "description": "Identifies CSS and JavaScript resources that block the browser from rendering the page.",
    "category": "performance"
  },
  {
    "slug": "robots-txt",
    "product": "pulse",
    "title": "robots.txt Is Valid",
    "description": "Ensure your robots.txt file is correctly formatted so search engines can parse your crawl directives.",
    "category": "seo"
  },
  {
    "slug": "aria-text",
    "product": "pulse",
    "title": "role=text Elements Don't Have Focusable Children",
    "description": "Ensure elements with role=text contain no focusable descendants.",
    "category": "accessibility"
  },
  {
    "slug": "aria-required-attr",
    "product": "pulse",
    "title": "Roles Have All Required ARIA Attributes",
    "description": "Ensure elements with ARIA roles include all required attributes for that role.",
    "category": "accessibility"
  },
  {
    "slug": "select-name",
    "product": "pulse",
    "title": "Select Elements Have Associated Labels",
    "description": "Ensure every select element has an associated accessible label.",
    "category": "accessibility"
  },
  {
    "slug": "image-size-responsive",
    "product": "pulse",
    "title": "Serve Images with Appropriate Resolution",
    "description": "Deliver images sized for the user's viewport to avoid wasting bandwidth on oversized files.",
    "category": "best-practices"
  },
  {
    "slug": "skip-link",
    "product": "pulse",
    "title": "Skip Links Are Focusable",
    "description": "Ensure skip navigation links are focusable and become visible on focus.",
    "category": "accessibility"
  },
  {
    "slug": "speed-index",
    "product": "pulse",
    "title": "Speed Index (SI)",
    "description": "What SI measures, how Lighthouse scores it, and how to improve it.",
    "category": "performance"
  },
  {
    "slug": "structured-data",
    "product": "pulse",
    "title": "Structured Data Is Valid",
    "description": "Add valid structured data to help search engines understand your content and enable rich results.",
    "category": "seo"
  },
  {
    "slug": "td-headers-attr",
    "product": "pulse",
    "title": "Table Cells Reference Headers in Same Table",
    "description": "Ensure td headers attributes point to th elements in the same table.",
    "category": "accessibility"
  },
  {
    "slug": "th-has-data-cells",
    "product": "pulse",
    "title": "Table Headers Have Data Cells",
    "description": "Ensure every th element in a table has associated data cells.",
    "category": "accessibility"
  },
  {
    "slug": "third-parties-insight",
    "product": "pulse",
    "title": "Third-Party Impact",
    "description": "Measures the performance cost of third-party scripts loaded on your page.",
    "category": "performance"
  },
  {
    "slug": "time-to-interactive",
    "product": "pulse",
    "title": "Time to Interactive (TTI)",
    "description": "What TTI measures, how Lighthouse scores it, and how to improve it.",
    "category": "performance"
  },
  {
    "slug": "total-blocking-time",
    "product": "pulse",
    "title": "Total Blocking Time (TBT)",
    "description": "What TBT measures, how Lighthouse scores it, and how to improve it.",
    "category": "performance"
  },
  {
    "slug": "target-size",
    "product": "pulse",
    "title": "Touch Targets Have Sufficient Size",
    "description": "Ensure interactive elements are large enough to tap accurately.",
    "category": "accessibility"
  },
  {
    "slug": "has-hsts",
    "product": "pulse",
    "title": "Use a Strong HSTS Policy",
    "description": "Enable HTTP Strict Transport Security to force browsers to always connect over HTTPS.",
    "category": "best-practices"
  },
  {
    "slug": "cache-insight",
    "product": "pulse",
    "title": "Use Efficient Cache Lifetimes",
    "description": "Checks whether your static assets use long cache lifetimes so repeat visitors load pages faster.",
    "category": "performance"
  },
  {
    "slug": "user-timings",
    "product": "pulse",
    "title": "User Timing Marks and Measures",
    "description": "Use the User Timing API to instrument custom performance milestones and measure what matters to your app.",
    "category": "performance"
  },
  {
    "slug": "is-on-https",
    "product": "pulse",
    "title": "Uses HTTPS",
    "description": "Serve your site over HTTPS to protect user data and meet modern browser requirements.",
    "category": "best-practices"
  },
  {
    "slug": "video-caption",
    "product": "pulse",
    "title": "Videos Have Captions",
    "description": "Ensure video elements include a track element with captions.",
    "category": "accessibility"
  },
  {
    "slug": "meta-viewport",
    "product": "pulse",
    "title": "Viewport Does Not Disable Zoom",
    "description": "Ensure the viewport meta tag allows users to zoom in.",
    "category": "accessibility"
  }
]
