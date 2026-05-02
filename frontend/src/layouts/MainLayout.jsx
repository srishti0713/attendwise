import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="pt-6 px-4 bg-linear-to-br from-[#F5E8EE] via-[#EDE8F5] to-[#E8EDF5] flex-1 overflow-y-auto min-h-0 pb-24">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
