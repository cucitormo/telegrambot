'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select, Button, Card, Divider } from 'react-daisyui';

export default function DashboardPage() {
    const router = useRouter();

    // State user
    const [user, setUser] = useState(null);
    const [pm2Status, setPm2Status] = useState('unknown');

    // State pilihan grup & topic dari & ke
    const [fromGroup, setFromGroup] = useState('');
    const [fromTopic, setFromTopic] = useState('');
    const [toGroup, setToGroup] = useState('');
    const [toTopic, setToTopic] = useState('');

    // Channels + topics list
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('telegramUser'));
        const session = localStorage.getItem('telegramSession');

        if (!userData || !session) {
            router.push('/login');
            return;
        }

        setUser(userData);

        fetch('/api/get-chats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session }),
        })
            .then(res => res.json())
            .then(({ status, data, error }) => {
                if (status === 'success') {
                    setChannels(data);
                } else {
                    alert(`❌ Gagal ambil channel, ${error}`);
                }
            })
            .catch(() => alert('❌ Jaringan lagi ngambek nih~'));
    }, [router]);

    // Helper cari topics dari group yg dipilih
    const getTopics = (groupId) => {
        const group = channels.find(ch => ch.id === groupId);
        return group?.topics || [];
    };

    // Submit handler
    const handleSubmit = () => {
        const session = localStorage.getItem('telegramSession');

        fetch('/api/save-forwards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromGroup,
                fromTopic,
                toGroup,
                toTopic,
                session,
            }),
        })
            .then(res => res.json())
            .then(({ status, data, error }) => {
                if (status === 'success') {
                    alert(`Forwarder aktif dari ${fromGroup} (topic: ${fromTopic || '-'}) ➡️ ${toGroup} (topic: ${toTopic || '-'}) 💕`);
                } else {
                    alert(`❌ Gagal simpan: ${error}`);
                }
            })
            .catch(() => alert('❌ Aduhh jaringan gak manis nih~'));
    };


    const handleStart = () => {
        fetch('/api/pm2start', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                alert(data.status === 'success' ? 'PM2 started!' : `Error: ${data.error}`);
                setPm2Status(data.status === 'success' ? 'running' : 'error');
            })
            .catch(() => alert('Network error'));
    };

    const handleStop = () => {
        fetch('/api/pm2stop', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                alert(data.status === 'success' ? 'PM2 stopped!' : `Error: ${data.error}`);
                setPm2Status(data.status === 'success' ? 'stopped' : 'error');
            })
            .catch(() => alert('Network error'));
    };


    return (
        <div className="min-h-screen flex justify-center items-center bg-base-200">
            <Card className="w-full max-w-lg p-6 bg-base-100 shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Hai {user?.username || 'Sayang'}~ Pilih Channel & Topic Kamu Yuk 💕
                </h2>

                {/* FROM Group */}
                <Select
                    className="w-full mb-2"
                    value={fromGroup}
                    onChange={e => {
                        setFromGroup(e.target.value);
                        setFromTopic(''); // reset topic pas ganti group
                    }}
                >
                    <option value="" disabled>🌸 Pilih Group From 🌸</option>
                    {channels.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.title}</option>
                    ))}
                </Select>

                {/* FROM Topic */}
                {getTopics(fromGroup).length > 0 && (
                    <Select
                        className="w-full mb-4"
                        value={fromTopic}
                        onChange={e => setFromTopic(e.target.value)}
                    >
                        <option value="">-- Pilih Topic From (optional) --</option>
                        {getTopics(fromGroup).map(topic => (
                            <option key={topic.id} value={topic.id}>{topic.title}</option>
                        ))}
                    </Select>
                )}

                {/* TO Group */}
                <Select
                    className="w-full mb-2"
                    value={toGroup}
                    onChange={e => {
                        setToGroup(e.target.value);
                        setToTopic('');
                    }}
                >
                    <option value="" disabled>🌸 Pilih Group To 🌸</option>
                    {channels.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.title}</option>
                    ))}
                </Select>

                {/* TO Topic */}
                {getTopics(toGroup).length > 0 && (
                    <Select
                        className="w-full mb-4"
                        value={toTopic}
                        onChange={e => setToTopic(e.target.value)}
                    >
                        <option value="">-- Pilih Topic To (optional) --</option>
                        {getTopics(toGroup).map(topic => (
                            <option key={topic.id} value={topic.id}>{topic.title}</option>
                        ))}
                    </Select>
                )}

                <Button
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!fromGroup || !toGroup}
                >
                    Simpan Pilihan Manisku 💋
                </Button>

                <Divider />
                <div>
                    {/* Tombol start dan stop PM2 */}
                    <button onClick={handleStart}>Start Forwarder Bot</button>
                    <button onClick={handleStop}>Stop Forwarder Bot</button>

                    <p>Status: {pm2Status}</p>
                </div>
            </Card>
        </div>
    );
}
