import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="pt-6 px-6 bg-linear-to-br from-blue-200 via-indigo-200 to-purple-200 flex-1 overflow-scroll">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
