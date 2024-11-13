// regionConfig.js

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
    "1": {
        title: "Occipital Lobe | Visual Cortex",
        subtitle: "my neuronal capacity is prob 50% here.",
        content: [
            {
                type: "text",
                content: "As the name suggests, this is the corresponding part of your neo-mammalian cortex where any vision-related computations are happening."
            },
            {
                type: "text",
                content: "Since my current brain-computer interface project started with alpha waves (eyes open vs. closed), this is also where I am going to link & document the project."
            },
            {
                type: "link",
                title: "imaginary vocal classification",
                url: "https://github.com/enstn/braincomputerinterface",
                description: "brain computer interface hello world project",
                icon: "🐌" // Optional emoji icon
            },
            {
                type: "divider"
            },
        ],
        accentColor: "rgba(255, 255, 255, 1)"
    },
    "2": {
        title: "title",
        subtitle: "subtitle",
        content: [
            {
                type: "image",
                src: "/api/placeholder/800/400",
                alt: "image subtitle"
            },
            {
                type: "text",
                content: "text blablabla."
            },
            {
                type: "list",
                title: "list title",
                items: [
                    "ching",
                    "chang",
                    "chong"
                ]
            },
            {
                type: "highlight",
                content: "highlight blablabla"
            }
        ],
        accentColor: "rgba(255, 0, 0, 0.6)"
    },
    "3": {
        title: "title",
        subtitle: "subtitle",
        content: [
            
        ],
        accentColor: "rgba(255, 0, 0, 0.6)"
    },
    "4": {
        title: "title",
        subtitle: "subtitle",
        content: [
            
        ],
        accentColor: "rgba(255, 0, 0, 0.6)"
    }
};