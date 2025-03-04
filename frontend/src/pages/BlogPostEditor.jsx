import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BlogPostEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getAuthHeaders } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!id;

    useEffect(() => {
        if (isEditing) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/${id}`);
            if (!response.ok) throw new Error('Failed to fetch post');
            const post = await response.json();
            setTitle(post.title);
            setContent(post.content);
        } catch (error) {
            console.error('Error fetching post:', error);
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = isEditing 
                ? `${import.meta.env.VITE_API_URL}/api/v1/blogs/${id}`
                : `${import.meta.env.VITE_API_URL}/api/v1/blogs`;

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) throw new Error('Failed to save post');
            
            const savedPost = await response.json();
            navigate(`/blog/${savedPost.id}`);
        } catch (error) {
            console.error('Error saving post:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {isEditing 
                            ? 'Update your blog post with the latest content and improvements.'
                            : 'Share your insights and expertise with our community.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                            placeholder="Enter a compelling title for your post"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-gray-700 text-sm font-semibold mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows="12"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                            placeholder="Write your blog post content here..."
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogPostEditor; 