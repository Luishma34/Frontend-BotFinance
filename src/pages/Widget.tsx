import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PluggyConnect } from 'react-pluggy-connect';
import { useAuth } from '../contexts/useAuth';
import { useToast } from '../components/Toast';
import { openFinanceService } from '../services/openFinanceService';
import type { Item } from 'pluggy-js';
import type { CreateItemData } from '../types/openFinance';

interface ItemFull extends Item {
    consentExpiresAt: Date;
}

interface ItemData {
    item: ItemFull;
}

const Widget = () => {
    const { token, username } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [connectToken, setConnectToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConnectToken = async () => {
            if (!token) {
                setError('Authentication token not found');
                setIsLoading(false);
                return;
            }

            try {
                const response = await openFinanceService.getConnectToken(token, username || '');
                setConnectToken(response.accessToken);
            } catch (err) {
                setError('Failed to fetch connect token');
                console.error('Error fetching connect token:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnectToken();
    }, [token, username]);

    const createItem = async (data: CreateItemData) => {
        if (!token) {
            console.error('Authentication token not found');
            return;
        }

        try {
            return await openFinanceService.createItem(token, data);
        } catch (err: any) {
            console.error('Error creating item:', err);
            if (err?.response?.status === 409) {
                throw { status: 409 };
            }
            throw err;
        }
    };

    const onSuccess = async (itemData: ItemData) => {
        const data: CreateItemData = {
            user_id: null,
            pluggy_connection_id: itemData.item.id,
            institution_name: itemData.item.connector.name,
            institution_image_url: itemData.item.connector.imageUrl,
            status: itemData.item.status,
            consent_expires_at: itemData.item.consentExpiresAt,
            last_updated_at: itemData.item.lastUpdatedAt,
        };

        console.log('Data to send:', data);
        console.log('Yay! Pluggy connect success!', itemData);

        try {
            await createItem(data);
            addToast('Nova conexão criada com sucesso', 'success');
            navigate('/open-finance');
        } catch (err: any) {
            console.error('Failed to create item:', err);
            if (err?.status === 409) {
                addToast('Conexão com este item já criada', 'warning');
            } else {
                addToast('Não foi possível criar a conexão, tente novamente mais tarde.', 'error');
            }
            navigate('/open-finance');
        }
    };

    const onError = (error: any) => {
        console.error('Whoops! Pluggy Connect error... ', error);
        addToast('Não foi possível criar a conexão, tente novamente mais tarde.', 'error');
        navigate('/open-finance');
    };

    if (isLoading) {
        return <div>Loading Pluggy Connect...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!connectToken) {
        return <div>No connect token available</div>;
    }

    return (
        <PluggyConnect
            connectToken={connectToken}
            includeSandbox={true}
            onSuccess={onSuccess}
            onError={onError}
        />
    );
};

export default Widget;