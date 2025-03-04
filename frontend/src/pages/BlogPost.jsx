// src/pages/Blogposts.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, isAdmin, getAuthHeaders } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [replyContent, setReplyContent] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPostAndComments();
    }, [id]);

    const fetchPostAndComments = async () => {
        setIsLoading(true);
        try {
            const postRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/${id}`);
            if (!postRes.ok) throw new Error('Failed to fetch post');
            const postData = await postRes.json();
            setPost(postData);

            const commentsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/${id}/comments/`);
            if (!commentsRes.ok) throw new Error('Failed to fetch comments');
            const commentsData = await commentsRes.json();

            // Comments are already nested from the backend
            setComments(commentsData);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const postComment = async (parentId = null) => {
        const content = parentId ? replyContent[parentId] : commentContent;
        if (!content) return;

        await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/comments/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content, post_id: id, parent_id: parentId })
        });

        if (parentId) {
            setReplyContent(prev => ({ ...prev, [parentId]: '' }));
        } else {
            setCommentContent('');
        }

        fetchPostAndComments();
    };

    const handleReplyChange = (parentId, value) => {
        setReplyContent(prev => ({ ...prev, [parentId]: value }));
    };

    const renderComments = (commentsList, level = 0) => {
        return commentsList.map(comment => (
            <div key={comment.id} className={`
                ${level === 0 ? 'border-l-4 border-primary pl-4 mt-4' : ''}
                ${level === 1 ? 'border-l-2 border-secondary pl-4 mt-3 ml-6' : ''}
                ${level === 2 ? 'pl-4 mt-2 ml-8 border-l border-gray-300' : ''}
            `}>
                <p className="font-semibold">{comment.user_name}</p>
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>

                {currentUser && (
                    <div className="mt-2">
                        <textarea
                            value={replyContent[comment.id] || ''}
                            onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                            placeholder={`Reply to ${level === 2 ? 'thread' : 'comment'}...`}
                            className="w-full p-2 border rounded"
                        />
                        <button 
                            onClick={() => postComment(comment.id)} 
                            className={`mt-2 py-1 px-4 text-white rounded
                                ${level === 2 ? 'bg-gray-500 hover:bg-gray-600' : 'bg-primary'}
                            `}
                        >
                            Reply
                        </button>
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className={level >= 2 ? 'ml-4' : ''}>
                        {renderComments(comment.replies, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            
            if (response.ok) {
                navigate('/blog');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <h1 className="text-3xl font-bold mb-8">Blog Post</h1>
                
                {post && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{post.title}</h2>
                            {isAdmin && (
                                <div className="space-x-4">
                                    <Link 
                                        to={`/blog/${id}/edit`}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={handleDelete}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    </div>
                )}
                
                {/* Comments section */}
                <section className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-4">Comments</h2>
                    {currentUser ? (
                        <div className="mb-6">
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full p-2 border rounded"
                                rows="3"
                            />
                            <button 
                                onClick={() => postComment()}
                                className="mt-2 bg-primary text-white py-2 px-4 rounded"
                            >
                                Post Comment
                            </button>
                        </div>
                    ) : (
                        <p className="mb-6">
                            Please <Link to="/login" className="text-primary hover:underline">login</Link> to comment.
                        </p>
                    )}
                    {renderComments(comments)}
                </section>
            </div>
        </div>
    );
};

export default BlogPost;