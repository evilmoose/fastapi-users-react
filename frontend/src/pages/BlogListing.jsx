import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

    if (isLoading) return <div className="container mx-auto p-6">Loading...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Stay updated with our latest insights, news, and expert perspectives on workflow automation.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                    {posts.map(post => (
                        <Link 
                            key={post.id} 
                            to={`/blog/${post.id}`}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-3 text-gray-900">{post.title}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                                <div className="text-sm text-gray-500">
                                    {new Date(post.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                {posts.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        <p className="text-lg">No blog posts yet.</p>
                        <p className="mt-2">Check back soon for new content!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogListing; 