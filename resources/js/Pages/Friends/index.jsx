import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router, useForm} from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Friends({ auth, friends}) {
    const [success, setSuccess] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors
    } = useForm({
        email: '',
    })

    const sendFriendRequest = (e) => {
        e.preventDefault();
        console.log('Sending friend request to', data.email)
        if (!data.email.includes('@')) {
            return;
        }

        post('/friend-requests', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSuccess(true);
            },
            onError: (errors) => {
                setSuccess(false);
            }
        });
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Friends</h2>}
        >
            <Head title="Friends" />

            <div className="container mx-auto">
                <div className="py-12">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-lg font-semibold mb-4">Add Friend</h3>
                        <form className="flex items-center" onSubmit={sendFriendRequest}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter friend's email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="flex-grow border border-gray-300 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                disabled={processing}
                            />
                            <button
                                type="submit"
                                className="bg-indigo-500 text-white p-2 rounded-r-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={processing}
                            >
                                Send
                            </button>
                        </form>
                        {errors.email && <p className="text-red-500 mt-2">{errors.email}</p>}
                        {success && <p className="text-green-500 mt-2">Friend request sent</p>}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h3 className="text-lg font-semibold mb-4">Friend List</h3>
                        {friends.length === 0 ? (
                            <p className="text-gray-500">You don't have any friends. You can add friends with the form above.</p>
                        ) : (
                            <ul className="list-disc list-inside">
                                {friends.map((friend, index) => (
                                    <li key={index} className="text-gray-700">{friend.name} - {friend.email}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
