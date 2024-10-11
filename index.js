import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const galleryJSON = '[{"id": "0001","type": "taco","name": "Chicken Taco","price": 2.99,"ingredients": {"protein": {"name": "Chicken","preparation": "Grilled"},  "salsa": {"name": "Tomato Salsa","spiciness": "Medium"},  "toppings": [{"name": "Lettuce",  "quantity": "1 cup",  "ingredients": ["Iceberg Lettuce"]  },      {"name": "Cheese",  "quantity": "1/2 cup",  "ingredients": ["Cheddar Cheese", "Monterey Jack Cheese"]  },      {"name": "Guacamole",  "quantity": "2 tablespoons",  "ingredients": ["Avocado", "Lime Juice", "Salt", "Onion", "Cilantro"]  },      {"name": "Sour Cream",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream"]  }      ]    }  },{"id": "0002","type": "taco","name": "Beef Taco","price": 3.49,"ingredients": {"protein": {"name": "Beef","preparation": "Seasoned and Grilled"},  "salsa": {"name": "Salsa Verde","spiciness": "Hot"},  "toppings": [{"name": "Onions",  "quantity": "1/4 cup",  "ingredients": ["White Onion", "Red Onion"]  },      {"name": "Cilantro",  "quantity": "2 tablespoons",  "ingredients": ["Fresh Cilantro"]  },      {"name": "Queso Fresco",  "quantity": "1/4 cup",  "ingredients": ["Queso Fresco"]  }      ]    }  },{"id": "0003","type": "taco","name": "Fish Taco","price": 4.99,"ingredients": {"protein": {"name": "Fish","preparation": "Battered and Fried"},  "salsa": {"name": "Chipotle Mayo","spiciness": "Mild"},  "toppings": [{"name": "Cabbage Slaw",  "quantity": "1 cup",  "ingredients": [    "Shredded Cabbage",    "Carrot",    "Mayonnaise",    "Lime Juice",    "Salt"          ]  },      {"name": "Pico de Gallo",  "quantity": "1/2 cup",  "ingredients": ["Tomato", "Onion", "Cilantro", "Lime Juice", "Salt"]  },      {"name": "Lime Crema",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream", "Lime Juice", "Salt"]  }      ]    }  }]';


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let album;
// Set view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route for the home page
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Route for the gallery page
app.get("/Gallery", (req, res) => {
    res.render("gallery.ejs", {recipe: album});
});

// Route to render the contact form (contact.ejs)
app.get("/Contact", (req, res) => {
    res.render("contact.ejs",{ query: req.query });
});

app.get("/Certificate",(req, res) => {
    res.render("certificate.ejs");
})
// Handle form submission from the contact form
app.post('/send-email', (req, res) => {
    const { name, email, mobile, service, message } = req.body;

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: process.env.EMAIL_USER,  // Your Gmail address
            pass: process.env.EMAIL_PASS // Your Gmail password or app password
        }
    });

    // Email options
    const mailOptions = {
        from: 'abraham.ukpaka@lpunetwork.edu.ph',
        to: 'abraham.ukpaka@lpunetwork.edu.ph',  // Your email where you want to receive details
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nService: ${service}\nMessage: ${message}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error); // Log the error
            return res.status(500).send('Error sending message.');
        }
  
        res.redirect('/Contact?success=true'); 
    });
  
});


// Listen on specified port
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
