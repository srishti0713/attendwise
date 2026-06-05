import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="pb-24 pt-6 px-4 bg-linear-to-br from-[#EDE8F5] via-[#F2EEE8] to-[#E8F0F5] flex-1 overflow-y-auto min-h-0">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
