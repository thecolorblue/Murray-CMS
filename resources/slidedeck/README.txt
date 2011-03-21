== SlideDeck v.1.x jQuery Plugin

Simplify your message and gain more results from your website.

Grab the attention of your users with a simple, rich user experience that gets 
them excited about your product or service. SlideDeck's simple, intuitive and 
engaging interface is a great way to draw attention to your offering while 
maintaining full search engine visibility.

Simplify text, complex visual elements and unclear product tours into 
easy-to-understand slides. SlideDeck presents your most critical information 
with logical ease and elegance.

SlideDeck is flexible and built to standards-based coding. Either a vertical 
or horizontal orientation can be built and the number of slides is fully 
configurable. Different colors and visual styles can also be programmed and 
additional in-slide functionality can be added.

Engaged visitors who can efficiently and effectively understand your product 
or service are most likely to convert into users and customers. First impressions 
on the web are critical. Give your business a clear advantage over your competitors.

For more information, see http://www.slidedeck.com/

== Installation/Usage

SlideDeck includes the jQuery JavaScript Framework v.1.3.2. You can use later
version as they become available (see http://www.jquery.com/).

Put jquery-1.3.2.js (or jquery-1.3.2.min.js) in a directory of your 
website, e.g. /javascripts.

Now, you can include the scripts by adding the following 
tags to the HEAD section of your HTML pages:

 <script src="/javascripts/jquery-1.3.2.min.js" type="text/javascript"></script>
 <script src="/javascripts/slidedeck.jquery.pack.js" type="text/javascript"></script>

Make a SlideDeck out of any <DL> tag by simply running the SlideDeck method
on the jQuery extended HTMLObject:

<script type="text/javascript">
 $('DL').slidedeck();
</script>

See http://www.slidedeck.com/usage-documentation for detailed usage instructions.

== The distribution

example.html            An example implementation of SlideDeck Pro
home-demo.html          An example implementation of SlideDeck Pro with the slidedeck.com home page SlideDeck. This
                        demo includes other CSS files and imagery for the content and some of the special interaction
                        we implemented for vertical navigation.
slidedeck.jquery.js     The SlideDeck library file
slidedeck.skin.css      The sample SlideDeck skin
LICENSE.txt             The license agreement for SlideDeck. Please read this
                        before using this JavaScript library.
README.txt              This file :)