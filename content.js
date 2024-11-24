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
                content: "This website documents my discovery progress and <span class=\"region-link\" data-region=\"booklist\">readings</span> reagarding: <br> ->  <span class=\"text-bold\">consciousness</span>,<span class=\"text-bold\">machine learning</span>, <span class=\"text-bold\">neurobiology</span> & <span class=\"text-bold\">neuromorphic engineering</span>"
            },
            {
                type: "text",
                content: "... and some other <span class=\"region-link\" data-region=\"random\">random stuff</span> to further increase entropy."
            },
            {
                type: "list",
                title: "Few Things About Me",
                items: [
                    "5th semester electrical engineering student at ETH Zurich",
                    "massive curiosity crush on the topics mentioned above",
                    "eternal yapper, this website partially exists to grant my family peace",
                    "currently developing telepathy; here's the <span class=\"region-link\" data-region=\"1\" data-subpage=\"1.1\">intro</span> if you're interested",
                ]
            },
            {
                type: "highlight",
                content: "To explore the website, just hover over the boxes on your left or click on the links above :)"
            },
            {
                type: "divider"
            },
            {
                type: "text",
                content: `
                Huge shoutout to Francesco Michlini for providing a free brain.glb model and a 3D rendering tutorial. <br> <br>
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
                        textFile: "content/website/website1"
                    },
                    {
                        type: "highlight",
                        content: `
                        1) create a github account and a git repo to store your code & host your website on github pages <br> <br> 
                        2) pick a LLM of your choice and prompt your intended behaviour of your website. Start with fundamental UI logic first before getting to the design 
                        -> (like mouse state detection, embedding content and linking between pages, close / open page buttons etc.) <br> <br>
                        3) review the code it spits out (just let the LLM or some indian ytber explain) <br> <br>
                        4) copy paste the part that seems good enough into your git repo (if you don't know, all in and hope for the best) <br> <br>
                        5) deploy and check if it works as intented <br> <br>
                        6) if yes: rinse and repeat step 2 to 5  <br>
                        -> if not: debug by feeding the error back into the LLM or go on stackoverflow / reddit, repeat until it works
                        `
                    },
                    {
                        type: "text",
                        textFile: "content/website/website2"
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
                description: "code documentation (still private as of now)",
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
                        Some late-night research, an extra question after class or even paper request followed by a teacher's response is not nearly as magical as a letter from Hogwarts, but it sure is mighty.
                        After all, you just gained a kind-hearted opportunity to learn from the wizards of the 21st century. Why wield wooden sticks if you can wield science? <br> <br> 

                        Which brings us back to our journey into telepathy, started by a single mail:
                        `
                    },
                    {
                        type: "highlight",
                        content: `
                        21.11.2024 | 21:12 <br> <br>
                        From: P&S Teacher <br>
                        To: Us <br>
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
                        type: "text",
                        textFile: "content/telepathy/intro/test"
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
