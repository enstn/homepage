// regionConfig.js

// html reminders, find under text-
// <span class=\"text-highlight\">word</span>
// <span class=\"region-link\" data-region=\"2\">temporal lobe</span>
// <span class=\"text-highlight-bold\">word</span>

// copy pastes:

/* image:
{
    type: "image",
    src: "/api/placeholder/800/400",
    alt: "Frontal Lobe Illustration"
},
*/

/* normal ass text:
{
    type: "text",
    content: "The frontal lobe is one of the most fascinating regions of the human brain. It serves as our command center."
},
*/

/* list:
{
    type: "list",
    title: "Key Functions",
    items: [
        "Executive decision making",
        "Personality expression",
        "Complex planning",
        "Emotional regulation"
    ]
},
*/

/* quote highlight:
{
    type: "highlight",
    content: "Did you know? The frontal lobe doesn't fully develop until around age 25."
},
*/

/* link:
{
    type: "link",
    title: "Research Paper",
    url: "javascript:void(0)",
    description: "Read more about frontal lobe development in adolescents",
    icon: "📄" // Optional emoji icon
},
*/

/* divider:
{
    type: "divider"
},


OR
{
    type: "divider",
    style: {
        margin: "2rem auto",
        height: "2px",
        width: "90%",  // Makes it even shorter
        color: "rgba(255, 255, 255, 0.2)"
    }
},
*/

export const regionContent = {
    "info": {
        title: "About This Website",
        subtitle: "congrats on excercising free will, you trigger-friendly bastard",
        content: [
            {
                type: "highlight",
                content: "WELCOME, YOU MAGNIFICENT BLOOP OF CELLS"
            },
            {
                type: "text",
                content: "300,000 years of evolution was required for this click-bait to work. Be proud."
            },
            {
                type: "highlight",
                content: "This is where I save & document my favourite discoveries and <span class=\"region-link\" data-region=\"booklist\">readings</span> for my research journey. <br> -> especially stuff related to <span class=\"text-highlight-bold\">consciousness</span>,<span class=\"text-highlight-bold\">machine learning</span>, <span class=\"text-highlight-bold\">neurobiology</span> & <span class=\"text-highlight-bold\">neuromorphic engineering</span> <br> (And everything else my 86 billion neurons might take fancy in)"
            },
            {
                type: "list",
                title: "A Few Things About Me",
                items: [
                    "I'm an electrical engineering student at ETH Zurich",
                    "Free time is currently spent on <span class=\"region-link\" data-region=\"2\">simulated neuron pong agent</span> & <span class=\"region-link\" data-region=\"1\">imagined speech recognition</span>",
                    "I have a massive curiosity crush on the topics mentioned above <br> -> one of the reasons I created this website is to grant my sister peace from my yapping",
                ]
            },
            {
                type: "highlight",
                content: "To explore my discoveries, just hover over the boxes on your left."
            },
            {
                type: "divider",
                style: {
                    margin: "2rem auto",
                    height: "2px",
                    width: "100%",  // Makes it even shorter
                    color: "rgba(255, 255, 255, 0.1)"
                }
            },
            {
                type: "text",
                content: "-> Learn from your mistakes. Do <span class=\"text-bold\">not</span> scroll down further. I warned you."
            },
            {
                type: "text",
                content: "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
            },
            {
                type: "image",
                src: "./images/rickroll.webp",
                alt: "why you scrolling so far"
            }
        ],
        accentColor: "rgba(255, 0, 0, 0.69)"
    },
    "booklist": {
        title: "Readings",
        subtitle: "",
        content: [
            
        ],
        accentColor: "rgba(255, 255, 255, 1)"
    },
    "random": {
        title: "Random Fun Facts",
        subtitle: "",
        content: [
            {
                type: "highlight",
                content: "First battery was invented because people were arguing about how to correctly shock frog legs. <br> ~ around 1781 | Volta vs. Galvani on inherent animal electricity fluid"
            },
            {
                type: "highlight",
                content: "T. Edison tried to establish the idea of dangerous AC by corrupting & influencing the frist ever electric chair to be powered by AC. <br> ~ date | current war"
            },
            {
                type: "highlight",
                content: "Placeholder <br> ~ date | context"
            }
        ],
        accentColor: "rgba(255, 255, 255, 1)"
    },
    "1": {
        title: "Imagined Speech Recognition",
        subtitle: "using BCI to achieve telepathy - because, unfortunately, the magical owl never showed up at my doorstep",
        content: [
            {
                type: "link",
                title: "github/enstn/braincomputerinterface",
                url: "https://github.com/enstn/braincomputerinterface",
                description: "code documentation",
                icon: "🐌" // Optional emoji icon
            },
            {
                type: "divider"
            },
            {
                type: "text",
                content: "The code is private at the moment. <update & explanation>"
            },
        ],
        accentColor: "rgba(255, 255, 255, 1)"
    },
    "2": {
        title: "Simulated Neuron Pong Agent",
        subtitle: "at least these neuron don't have to search for a meaning of life - for them, it's pong",
        content: [
            {
                type: "link",
                title: "github/enstn/neuropong",
                url: "https://github.com/enstn/neuropong",
                description: "code documentation",
                icon: "🐌" // Optional emoji icon
            },
            {
                type: "divider"
            },
            {
                type: "image",
                src: "./images/neuropong_readme",
                alt: "why you scrolling so far"
            },
            {
                type: "text",
                content: "I'll have to update & describe my progress. Maybe I should do a Notion embedding."
            }
        ],
        accentColor: "rgba(255, 255, 255, 1)"
    },
    "3": {
        title: "title",
        subtitle: "subtitle",
        content: [
            
        ],
        accentColor: "rgba(255, 0, 0, 0.6)"
    },
};