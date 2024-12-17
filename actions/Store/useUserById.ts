import { useState, useEffect } from 'react';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

const useUserById = (userId: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/user/${userId}`);
                if (!res.ok) {
                    throw new Error('User not found');
                }
                const data: User = await res.json();
                setUser(data);
            } catch (error) {
                return setError('User not found');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    return { user, loading, error };
};

export default useUserById;
