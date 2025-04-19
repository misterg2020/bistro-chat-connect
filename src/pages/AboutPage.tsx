
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">À propos de MRG RESTAU</h1>
          
          <div className="mb-12 aspect-video overflow-hidden rounded-xl">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="MRG RESTAU"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Notre Histoire</h2>
              <p className="text-lg">
                Fondé en 2020, MRG RESTAU est né d'une passion pour la cuisine authentique. Notre mission est de vous offrir une expérience culinaire inoubliable, mêlant traditions et innovations pour satisfaire les palais les plus exigeants.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Notre Philosophie</h2>
              <p className="text-lg">
                Chez MRG RESTAU, nous croyons que la cuisine est un art qui se déploie à travers des ingrédients frais et de qualité. Chaque plat est préparé avec soin par nos chefs, dans le respect des traditions culinaires tout en apportant une touche de modernité.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Notre Équipe</h2>
              <p className="text-lg">
                Notre équipe est composée de professionnels passionnés, dévoués à vous offrir un service de qualité. Du chef à l'équipe en salle, chacun contribue à faire de votre passage chez MRG RESTAU un moment unique.
              </p>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Contactez-nous</h2>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="font-semibold w-24">Email:</span>
                  <a href="mailto:mrgseller@gmail.com" className="hover:underline">mrgseller@gmail.com</a>
                </p>
                <p className="flex items-center">
                  <span className="font-semibold w-24">Téléphone:</span>
                  <a href="tel:+2250544867755" className="hover:underline">+2250544867755</a>
                </p>
                <p className="flex items-center">
                  <span className="font-semibold w-24">Adresse:</span>
                  <span>123 Avenue de la Gastronomie, Abidjan</span>
                </p>
                <p className="flex items-center">
                  <span className="font-semibold w-24">Horaires:</span>
                  <span>Tous les jours de 11h à 23h</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
