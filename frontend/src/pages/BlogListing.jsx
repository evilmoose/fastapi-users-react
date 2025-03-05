import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LayoutWithScroll from '../components/LayoutWithScroll';

const BlogListing = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return (
        <LayoutWithScroll>
            <div className="flex items-center justify-center h-full">
                <p className="text-lg text-neutral-600">Loading...</p>
            </div>
        </LayoutWithScroll>
    );

    return (
        <LayoutWithScroll>
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-primary">Our Blog</h1>
                <p className="text-lg text-neutral-600 mt-4">
                    Latest insights, tips, and updates from our team
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {post.image && (
                            <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
                                {post.title}
                            </h2>
                            <p className="text-neutral-600 mb-4 line-clamp-3">
                                {post.excerpt || post.content.substring(0, 150) + '...'}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-500">
                                    {new Date(post.created_at).toLocaleDateString()}
                                </span>
                                <Link 
                                    to={`/blog/${post.id}`}
                                    className="text-accent-blue hover:underline font-medium"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {posts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-neutral-600">No blog posts found.</p>
                </div>
            )}
        </LayoutWithScroll>
    );
};

export default BlogListing; 