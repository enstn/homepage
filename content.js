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
export async function loadTextContent(filename) {
    try {
        const response = await fetch(`/~lejiang/${filename}.txt`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        return await response.text();
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return 'Content loading failed.';
    }
}

export const regionContent = {
    "info": {
        title: "About This Website",
        subtitle: "Welcome, you magnificent bloop of cells!",
        content: [
            {
                type: "highlight",
                content: `
                This website documents my discovery progress and <span class=\"region-link\" data-region=\"booklist\">readings</span> regarding: <br> 
                ->  <span class=\"text-bold\">consciousness</span>, <span class=\"text-bold\">artificial intelligence</span> & <span class=\"text-bold\">neurobiology</span> 
            `
            },
            {
                type: "text",
                content: `
                ... and some other <span class=\"region-link\" data-region=\"random\">random stuff</span> to further increase entropy. 
                Blogging here grants my family peace from my eternal yapping. 
                If you experience website issues, please check the <span class=\"region-link\" data-region=\"info\" data-subpage=\"info.1\">version control</span>. 
                `
            },
            {
                type: "highlight",
                content: `
                To explore the website, just click on links that peak your interest or the tiny boxes on your left. 
                <span class=\"region-link\" data-region=\"info\" data-subpage=\"info.2\">Hotkeys</span> are also available.
                Clicking on the brain might hold a little surprise :) 
                `
            },
            {
                type: "list",
                title: "Few Things About Me",
                items: [
                    "electrical engineering student at ETH Zurich",
                    "massive curiosity crush on the topics mentioned above",
                    "currently working on telepathy; here's the <span class=\"region-link\" data-region=\"1\" data-subpage=\"1.1\">intro</span> if you're interested",
                ]
            },
            {
                type: "divider"
            },
            {
                type: "text",
                content: `
                Huge shoutout to Francesco Michlini for providing a free brain.glb model and a 3D rendering tutorial. Special thanks 
                to my sister for being the most patient web testclient. <br> <br>
                Don't scroll down to the end. This is a blatant scroll bait.
                `
            },
            {
                type: "text",
                content: "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
            },
            {
                type: "image",
                src: "./images/rickroll.webp",
                alt: "why you scrolling so far"
            }
        ],
        subpages: {
            "info.1": {
                title: "Version Control",
                accentColor: "rgba(255, 225, 225, 1)",
                subtitle: "",
                content: [
                    {
                        type: "text",
                        textFile: "content/about_this_website/vcinfo"
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "highlight",
                        textFile: "content/about_this_website/vc1"
                    },
                    {
                        type: "highlight",
                        textFile: "content/about_this_website/vc2"
                    },
                ]
            },
            "info.2": {
                title: "Hotkeys",
                accentColor: "rgba(255, 225, 225, 1)",
                subtitle: "not vim-styled, sorry F.K.",
                content: [
                    {
                        type: "list",
                        title: "the key bindings are as following: ",
                        items: [
                            "numbers '1' to '5' => boxes 1 - 5",
                            "'q' => quit and close current page",
                            "'i' => information about this website",
                            "'v' => version control"
                        ]
                    },
                    {
                        type: "divider"
                    }
                ]
            },
        },
        accentColor: "rgba(255, 0, 0, 0.69)"
    },
    "random": {
        title: "Random Output",
        subtitle: "",
        content: [
            {
                type: "text",
                content: `
                <div class="date-item">
                    <span class="region-link" data-region="random" data-subpage="random.1">Fun Facts</span>
                    <div class="date-dots"></div>
                    <span class="date-label">📁</span>
                </div>
                `
            },
            {
                type: "text",
                content: `
                <div class="date-item">
                    <span class="region-link" data-region="random" data-subpage="random.2">Cheese Is Where The Magic Happens</span>
                    <div class="date-dots"></div>
                    <span class="date-label">quantum mechanics rant</span>
                </div>
                `
            },
            {
                type: "text",
                content: `
                <div class="date-item">
                    <span class="region-link" data-region="random" data-subpage="random.3">Website-Building for Dummies</span>
                    <div class="date-dots"></div>
                    <span class="date-label">web-frontend rant</span>
                </div>
                `
            }
        ],
        subpages: {
            "random.1": {
                title: "Fun Facts",
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
                ]
            },
            "random.2": {
                title: "Cheese Is Where The Magic Happens",
                subtitle: "inspired by MIT spring lectures on quantum mechanics by Prof. Adams",
                content: [
                    {
                        type: "text",
                        content: `
                        The best thing about writing an intro to quantum mechanics is that <span class=\"text-bold\">nothing matters</span>. <br>
                        You avoided physics in highschool? Perfect. 
                        You don't have an intuition for physics? Even better! <br> <br>
                        Quantum mechanics is counterintuitive, so not having a newtonian intuition at all actually comes in handy. 
                        `
                    },
                ]
            },
            "random.3": {
                title: "Website-Building for Dummies",
                subtitle: "",
                accentColor: "rgba(225, 225, 225, 1)",
                content: [
                    {
                        type: "text",
                        textFile: "content/rant_frontend/rant_frontend1"
                    },
                    {
                        type: "highlight",
                        textFile: "content/rant_frontend/rant_frontend2"
                    },
                    {
                        type: "text",
                        textFile: "content/rant_frontend/rant_frontend3"
                    },
                    {
                        type: "divider"
                    }
                ]
            }
        },
        accentColor: "rgba(255, 255, 255, 1)"
    },
    "1": {
        title: "Imagined Speech Recognition",
        subtitle: "using electroencephalogram-based BCI to achieve telepathy | because, unfortunately, Hogwarts' letter never arrived",
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
                    <span class="region-link" data-region="1" data-subpage="1.1">Muggles' Equivalent of Magic</span>
                    <div class="date-dots"></div>
                    <span class="date-label">introduction</span>
                </div>
                `
            },
            {
                type: "text",
                content: `
                <div class="date-item">
                    <span class="region-link" data-region="1" data-subpage="1.2">Introduction to Telepathy</span>
                    <div class="date-dots"></div>
                    <span class="date-label">chapter 1</span>
                </div>
                `
            }
        ],
        subpages: {
            "1.1": {
                title: "Muggles' Equivalent of Magic",
                subtitle: "introduction chapter",
                accentColor: "rgba(225, 225, 225, 1)",
                content: [
                    {
                        type: "highlight",
                        content: `
			            Imagine typing "Hello World". Not with your fingers, but by simply <span class=\"text-italic\"> imagining </span>  the letters. 
			            `
                    },
                    {
                        type: "text",
                        content: `
			            Does this sound like science fiction? Or some black magic vodoo written in fantasy? To be honest, I too wasn't aware of this possibility... until a few weeks ago. 
                        So, dear reader, I invite you to join me. <br> <br>
                        
                        This will be our technological crusade against the universe's cruel refusal to gift humanity with magic.
                        For this might be our most promising shot yet towards archieving man-made telepathy without touching a wand. <br> <br>

			            Let me set the stage before we head straight in. My university mandates students to attend so-called P&S's (Praktikum & Seminare). By doing so, the all-mighty education system hopes to bestow hands-on-experience upon our 
			            little peasant brains. Yeah, <span class=\"text-italic\">right</span>. Sitting around for three hours on a random Tuesday afternoon will <span class=\"text-italic\">surely</span> give us profound insights into the technological 
			            landscape molded by homo sapiens. <br> <br> Obviously not. Dimwit. <br> <br>

                        Most P&S time-bounds simply don't allow the teachers to go beyond the surface. And most students don't venture beyond the shown surface. <br> <br>

			            Therefore, P&S naturally turns into a game of min-maxing credit-efficiency. You have the grand choice between the following: 
                        `
                    },
                    {
                        type: "list",
                        title: "",
                        items: [
                            `
                            invest extra effort with no extra credits to explore spectacular (but exam-irrelevant) concepts
                            `,
                            `
                            choose something vaguely interesting which doesn't suffocate your exam time 
                            `,
                        ]
                    },
                    {
                        type: "text",
                        content: `
                        The true <span class=\"text-italic\">spirit of education</span> demands option one, but who cares about spirits in this day and age anyways? (Besides, maybe, alcoholics.) Like seriously.
			            What truly matters is option two: passing exams, quickly getting a degree and crunching numbers in excell sheets for five decades. <br> 
                        A modern human shall exist exclusively to maximise shareholders value and stop only once to upload itself into an eternal game of death jockeying.
                        `
                    },
                    {
                        type: "divider",
                        style: {
                            margin: "2rem auto",
                            height: "2px",
                            width: "90%",  // Makes it even shorter
                            color: "rgba(255, 255, 255, 0.2)"
                        }
                    },
                    {
                        type: "text",
                        content: `
                        Jokes aside, I'm no better. Almost all of my previous P&S were selected based on credit-efficiency with a slight interest in the covered topics.
                        That being said, if you were willing to sacrifice your free time & quite a bit of beauty sleep, and if you were willing to voluntarily dig deeper into P&S related 
                        research fields - you'll find amazing professors and PhDs welcoming our combined single-digit IQ.
                        
                         <br> <br> 
                        A late-night research session, an extra question after class or even paper request followed by a teacher's response is not nearly as magical as a letter from Hogwarts, but it sure is mighty.
                        After all, you just gained a kind-hearted opportunity to learn from the wizards of the 21st century. Why wield wooden sticks if you can wield science? <br> <br> 

                        Which brings us back to our journey into telepathy, started by a single mail:
                        `
                    },
                    {
                        type: "highlight",
                        content: `
                        21.11.2024 | 21:12 <br> <br>
                        From: <br>
                        To: <br>
                        Subject: Opportunity to Collaborate on Speech Imagery Project <br> 
                        ... <br>
                        `
                    },
                    {
                        type: "text",
                        content: `
                        And so, dear reader, we begin. Let's imagine letters, wielding the power of 21st-century wizardry, and see just how close we can get to breaking the barriers between mind and machine.
                        `
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "text",
                        content: `
                        -> <span class=\"region-link\" data-region=\"1\" data-subpage=\"1.2\">[Chapter One: Introduction To Telepathy]</span>
                        `
                    }
                ]
            },
            "1.2": {
                title: "Introduction to Telepathy",
                subtitle: "chapter 1",
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
        title: "Neuropong",
        subtitle: "training simulated neurons to play pong",
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
        title: "Neurobiology",
        subtitle: "abusing feynman-technique for my self-study journey",
        content: [

        ],
        accentColor: "rgba(255, 0, 0, 0.6)"
    },
    "booklist": {
        title: "Readings",
        subtitle: "rating based on degree of perspective / behavior change caused by said book",
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
                        content: "9/10 - Fascinating insights into neuroplasticity"
                    },
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
