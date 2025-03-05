// src/pages/Blogposts.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LayoutWithScroll from '../components/LayoutWithScroll';

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
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching post and comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/comments/`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ content: commentContent, post_id: id, parent_id: null })
            });
            setCommentContent('');
            fetchPostAndComments();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const toggleReplyForm = (commentId) => {
        setReplyContent(prev => {
            const newState = { ...prev };
            if (newState[commentId] === undefined) {
                newState[commentId] = '';
            } else {
                delete newState[commentId];
            }
            return newState;
        });
    };

    const handleReplyChange = (commentId, value) => {
        setReplyContent(prev => ({ ...prev, [commentId]: value }));
    };

    const handleReplySubmit = async (parentId) => {
        if (!replyContent[parentId]?.trim()) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/comments/`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ 
                    content: replyContent[parentId], 
                    post_id: id, 
                    parent_id: parentId 
                })
            });
            setReplyContent(prev => ({ ...prev, [parentId]: undefined }));
            fetchPostAndComments();
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/comments/${commentId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            fetchPostAndComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleDeleteReply = async (commentId, replyId) => {
        if (!window.confirm('Are you sure you want to delete this reply?')) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/comments/${replyId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            fetchPostAndComments();
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                navigate('/blog');
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (isLoading) return (
        <LayoutWithScroll>
            <div className="flex items-center justify-center h-full">
                <p className="text-lg text-neutral-600">Loading...</p>
            </div>
        </LayoutWithScroll>
    );
    
    if (!post) return (
        <LayoutWithScroll>
            <div className="flex items-center justify-center h-full">
                <p className="text-lg text-neutral-600">Post not found</p>
            </div>
        </LayoutWithScroll>
    );

    return (
        <LayoutWithScroll>
            <h1 className="text-3xl font-bold text-primary mb-8">Blog Post</h1>
            
            {post && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{post.title}</h2>
                        {isAdmin && (
                            <div className="space-x-4">
                                <Link 
                                    to={`/blog/${id}/edit`}
                                    className="bg-accent-blue text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </Link>
                                <button 
                                    onClick={handleDelete}
                                    className="bg-accent-red text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{post.content}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold mb-6">Comments</h3>
                
                <div className="mb-8">
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-4 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        rows="4"
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                        <button
                            onClick={handleCommentSubmit}
                            className="bg-accent-blue text-white px-4 py-2 rounded hover:bg-blue-600"
                            disabled={!commentContent.trim()}
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
                
                {comments.length > 0 ? (
                    <div className="space-y-6">
                        {comments.map(comment => (
                            <div key={comment.id} className="border-b border-neutral-200 pb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-medium">{comment.user_email}</p>
                                        <p className="text-sm text-neutral-500">
                                            {new Date(comment.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {(currentUser?.email === comment.user_email || isAdmin) && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-accent-red hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <p className="text-neutral-700 mb-4">{comment.content}</p>
                                
                                {/* Reply section */}
                                <div className="ml-8 mt-4">
                                    <button
                                        onClick={() => toggleReplyForm(comment.id)}
                                        className="text-accent-blue hover:underline text-sm mb-2"
                                    >
                                        Reply
                                    </button>
                                    
                                    {replyContent[comment.id] !== undefined && (
                                        <div className="mt-2">
                                            <textarea
                                                value={replyContent[comment.id]}
                                                onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                                                placeholder="Write a reply..."
                                                className="w-full p-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                                rows="3"
                                            ></textarea>
                                            <div className="mt-2 flex justify-end">
                                                <button
                                                    onClick={() => handleReplySubmit(comment.id)}
                                                    className="bg-accent-blue text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                                    disabled={!replyContent[comment.id]?.trim()}
                                                >
                                                    Post Reply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Display replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="mt-4 space-y-4">
                                            {comment.replies.map(reply => (
                                                <div key={reply.id} className="border-t border-neutral-100 pt-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="font-medium">{reply.user_email}</p>
                                                            <p className="text-sm text-neutral-500">
                                                                {new Date(reply.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        {(currentUser?.email === reply.user_email || isAdmin) && (
                                                            <button
                                                                onClick={() => handleDeleteReply(comment.id, reply.id)}
                                                                className="text-accent-red hover:underline text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-neutral-700">{reply.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-600 text-center py-4">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </LayoutWithScroll>
    );
};

export default BlogPost;