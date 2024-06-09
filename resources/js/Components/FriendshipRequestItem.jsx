import {router} from "@inertiajs/react";

export default function ApplicationLogo({ request }) {

    const approveRequest = async () => {
        router.post(`/friend-requests/${request.id}/approve`, [])
    }

    const declineRequest = async () => {
        router.post(`/friend-requests/${request.id}/reject`, [])
    }

    return (
        <div className="flex items-center p-2 border-b border-gray-200 bg-white">
            <img
                src={request.avatar}
                alt={request.username}
                className="h-10 w-10 rounded-full"
            />
            <div className="ms-2 flex-1">
                <div className="font-semibold">{request.username}</div>
                <div className="text-gray-500 text-sm">Wants to be your friend</div>
            </div>
            <div className="flex space-x-2">
                <button
                    className="btn btn-primary px-3 py-1 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    onClick={() => approveRequest(request.id)}
                >
                    Accept
                </button>
                <button
                    className="btn btn-secondary px-3 py-1 rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-75"
                    onClick={() => declineRequest(request.id)}
                >
                    Decline
                </button>
            </div>
        </div>
    );
}
