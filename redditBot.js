const snoowrap = require("snoowrap");
const { CommentStream } = require("snoostorm");

const r = new snoowrap({
  userAgent: process.env.USER_AGENT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

const stream = new CommentStream(r, {
  subreddit: "AutoEntrepreneur+freelanceFR+france",
  limit: 20,
  pollTime: 30000,
});

const message = `J’étais dans la même galère pour savoir combien je touchais réellement en tant qu’auto-entrepreneur (charges, impôts, etc.). Du coup j’ai codé un simulateur gratuit pour ça : [https://simulauto.fr](https://simulauto.fr)\n\nIl calcule le revenu net en fonction de ton activité (service ou commerce), avec ou sans versement libératoire, et indique si tu dépasses les seuils TVA/plafond.\n\nSi ça peut aider quelqu’un 🙌`;

const dejaRepondu = new Set();

stream.on("item", (comment) => {
  const texte = comment.body.toLowerCase();
  const id = comment.id;

  const motsCles = [
    "auto-entrepreneur",
    "micro entreprise",
    "charges",
    "impôts",
    "revenu net",
    "urssaf",
    "calcul",
    "freelance",
  ];

  if (
    !dejaRepondu.has(id) &&
    motsCles.some((mot) => texte.includes(mot))
  ) {
    comment.reply(message)
      .then(() => {
        console.log(`✅ Réponse postée sur : ${id}`);
        dejaRepondu.add(id);
      })
      .catch((err) => {
        console.error("Erreur :", err);
      });
  }
});
