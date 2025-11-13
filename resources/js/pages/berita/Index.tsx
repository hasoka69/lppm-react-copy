import React from 'react';
import Navbar from '../../components/navbar';
import NewsLayout from '../../components/NewsLayout';
import Footer from '../../components/footer';
import NewsSection from '../../components/NewsSection';

const DUMMY_ARTICLES = [
    {
        id: 1,
        title: "Wine Goes Digital",
        author: "Henrietta Mitchell",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lobortis sapien vel neque posuere porta.",
        imageUrl: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcSJhGQna_g6vgDVpP4No-HCJv2PSWgZasoBrx04QZMytdJlulWSSZ9LzQWIDcxivFOhDn9eZrnDzhsb0zE",
        category: "FOOD & WINE",
        date: "10.05.2025"
    },
    {
        id: 2,
        title: "Why Business Management For Startups Is Essential For Growth",
        author: "Rufus Stewart",
        excerpt: "Business management is crucial for startups to ensure growth and sustainability.",
        imageUrl: "https://images.unsplash.com/photo-1552581234-26160f608093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
        category: "BUSINESS",
        date: "17.11.2019"
    },
    {
        id: 3,
        title: "How The Internet Can Increase Productivity",
        author: "Jane Doe",
        excerpt: "The internet offers various tools that can enhance productivity in the workplace.",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
        category: "LIFESTYLE",
        date: "05.12.2029"
    }
];

const BeritaPage = () => {
    return (
        <div className="w-full"> {/* Pastikan ini w-full */}
            <Navbar />
            <img
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgICAcICAcHBwcHBwoHBwcHBw8ICQcKFREWFhURExMYHSggGBoxGx8TITEhMSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDw0PDysZFRkrLTc3LSsrLTctNysrKystLSsrKzcrKzc3Ny03LS0tLTcrLTc3Ky03Ny0tLS0tLSsrK//AABEIALcBEwMBIgACEQEDEQH/xAAaAAEBAQADAQAAAAAAAAAAAAAAAQIDBAUH/8QAFxABAQEBAAAAAAAAAAAAAAAAAAERQf/EABsBAAMBAQEBAQAAAAAAAAAAAAABAgMEBgUH/8QAGhEBAQEBAQEBAAAAAAAAAAAAAAECERIhQf/aAAwDAQACEQMRAD8A+IarKuqVKiKuUC6g0lJoRWudErUrCts6JpYko3zomipCtPXwFQVFoGbVtZZapgIytMBKztBaCMrTAEWmJVZZ2gARTAEgATwIKDyFgK6ZCAFSABVSEASLkCgLlJY1GFlbZ0TQDeX4SparNRqmgDK0xCjO0FQoztNKAzMRU6mgRpmooAEWGAFwALhzIQaF+SAGkgAVUIAipARQXIQAoCiKgalaYWVpnRUqKgtAIVnTAEUIAzpoAgwArAiiJ4DDBS4EwxQ/IAFTIBcVp5LrICDFBcIiguQgCKCwEVAAGBQMAAoEqpU0ACKEFqIsNBRPAgBcMALgAU+EguLipkIorSZJMFGnkMKiuWGEFXAALIikFQIAoCgYAAAABFRUhBUSAwE8CYKFwIKDyEMUPyExTA5kAouZAshIrXOSMAaeScSg+fFkUhVwggsVAIqKACmAAwAAABkIoVhgBBDALgMMFHAmCg4EUU/IQXFxcyXUkVUaTJC4SK1zkGCjTwTgAj5EaKAuEKkVUCAKAsRYAAGAAAAAAAAWGK4SC4uDyGRrA/I6mGNBzITAFzJKi4uLmQmLijSYIBrG2ckmCjTwHWWIsefjUCiyItSLVQIAoCoAKAYAAAEAVAILGoysXmlWhBtISouGH5CKuCpkJi4ouYIBcaTIRZFwazJAqyNs4LqDQ08E6aory8bACgpUVUCAKAAAAAAAAAAChAIiiUNLEg6cVLSpFdGeUgFxpMki4uC5kGArWYJFxZFa5wSYosjbOCQaGvgddFUV42NyhRQFQOBQFBBQBBQBFDR0AmhdBoBAAEv0NRWY1G+KVWNMxY6sUljUZWOjNSqosdGSWRQbZzCBZFbZwXUkVSRvnBA1g18E85Yix4OOoAUQAAAGAAAAAACAAOgDUTaDViEKX6bSxlY6MUmmoysdWalpYhHTmpaVIOjNJqKkV0ZpLFZajozUqsQjozSaAa9HHnAPz91GqBgAMgAAAAAAAAA1ASYAQAC/QqwG+Saig6sJWKDqwVWKDoySxoHRlIsB0ZKqoOjKWoA0D//Z"
                alt="Header"
                className="w-full h-64 object-cover mb-8"
            />

            <NewsLayout articles={DUMMY_ARTICLES} />
            <NewsSection />
            <Footer />
        </div>
    );
};

export default BeritaPage;