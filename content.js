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

/* subpage example
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
                content: "<span class=\"region-link\" data-region=\"1\" data-subpage=\"1.1\">subpage embedding test</span>"
            }
        ],
        subpages: {
            "1.1": {
                title: "test subpage embedding",
                subtitle: "test subtitle",
                content: [
                    {
                        type: "text",
                        content: "blablabla."
                    },
                ]
            },
        },
        accentColor: "rgba(255, 255, 255, 1)"
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
                content: "This website is being used to document my discovery progress and <span class=\"region-link\" data-region=\"booklist\">readings</span> reagarding: <br> ->  <span class=\"text-highlight-bold\">consciousness</span>,<span class=\"text-highlight-bold\">machine learning</span>, <span class=\"text-highlight-bold\">neurobiology</span> & <span class=\"text-highlight-bold\">neuromorphic engineering</span> <br> (And some other random stuff my 86 billion neurons took an interest in)"
            },
            {
                type: "list",
                title: "Few Things About Me",
                items: [
                    "I'm an electrical engineering student at ETH Zurich",
                    "Currently working on <span class=\"region-link\" data-region=\"2\">simulated neuron pong agent</span> & <span class=\"region-link\" data-region=\"1\">imagined speech recognition</span>",
                    "I have a massive curiosity crush on the topics mentioned above",
                ]
            },
            {
                type: "highlight",
                content: "To explore the website, just hover over the boxes on your left."
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
                content: "-> Learn from your mistakes. Do <span class=\"text-bold\">not</span> scroll down further. Consider this a warning."
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
                content: `
                <div class="date-item">
                    <span class="region-link" data-region="1" data-subpage="1.1">subpage embedding test</span>
                    <div class="date-dots"></div>
                    <span class="date-label">15.11.24</span>
                </div>
                `
            },
            {
                type: "text",
                content: `
                <div class="date-item">
                    <span class="region-link" data-region="1" data-subpage="1.2">project setup & grand overview</span>
                    <div class="date-dots"></div>
                    <span class="date-label">15.11.24 | 06:01</span>
                </div>
                `
            }
        ],
        subpages: {
            "1.1": {
                title: "test subpage embedding",
                subtitle: "test subtitle",
                content: [
                    {
                        type: "text",
                        content: "blablabla."
                    },
                ]
            },
            "1.2": {
                title: "project setup & overview",
                subtitle: "test subtitle",
                content: [
                    {
                        type: "text",
                        content: "blablabla."
                    },
                ]
            }
        },
        accentColor: "rgba(255, 255, 255, 1)"
    },
    "2": {
        title: "Simulated Neuron Pong Agent",
        subtitle: "these neurons already discovered their meaning of life: playing pong",
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
                type: "text",
                content: `
                <div class="date-item">
                    <span class="region-link" data-region="2" data-subpage="2.1">one</span>
                    <div class="date-dots"></div>
                    <span class="date-label">15.11.24 | 06:29</span>
                </div>
                `
            },
            {
                type: "text",
                content: `
                <div class="date-item">
                    <span class="region-link" data-region="2" data-subpage="2.2">two</span>
                    <div class="date-dots"></div>
                    <span class="date-label">15.11.24 | 06:29</span>
                </div>
                `
            }
        ],
        subpages: {
            "2.1": {
                title: "one",
                subtitle: "test subtitle",
                content: [
                    {
                        type: "text",
                        content: "blablabla."
                    },
                ]
            },
            "2.2": {
                title: "two",
                subtitle: "test subtitle",
                content: [
                    {
                        type: "text",
                        content: "blablabla."
                    },
                ]
            }
        },
        accentColor: "rgba(255, 255, 255, 1)"
    },
    "3": {
        title: "title",
        subtitle: "subtitle",
        content: [
            
        ],
        accentColor: "rgba(255, 0, 0, 0.6)"
    },
    "booklist": {
        title: "Readings",
        subtitle: "rating based on change of behaviour / perspective caused by said book",
        content: [
            {
                type: "custom-booklist",
                items: [
                    {
                        id: "brain-changes",
                        title: "The Brain that Changes Itself",
                        author: "Norman Doidge",
                        score: 9
                    },
                    {
                        id: "place-holder",
                        title: "placeholer for template",
                        author: "",
                        score: 0
                    }
                ]
            }
        ],
        subpages: {
            "brain-changes": {
                title: "The Brain that Changes Itself",
                subtitle: "Norman Doidge",
                content: [
                    {
                        type: "highlight",
                        content: "Score: 9/10 - Fascinating insights into neuroplasticity"
                    },
                    {
                        type: "text",
                        content: "notes about this book..."
                    }
                ]
            },
            "place-holder": {
                title: "template",
                subtitle: "blabla",
                content: [
                    {
                        type: "highlight",
                        content: "Score: 0/10 - blabla"
                    },
                    {
                        type: "text",
                        content: "notes about this book..."
                    }
                ]
            }
        },
        accentColor: "rgba(255, 255, 255, 1)"
    }
};
