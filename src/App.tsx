import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, Receipt, Calculator, RefreshCw, ArrowRight, X, Copy, ArrowLeft, Users, FolderPlus, ChevronDown, Check } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- Type Definitions ---
type Member = { id: string; name: string; };
type ExpenseParticipant = { memberId: string; share: number; };
type ExpensePayer = { memberId: string; amount: number; };
type Expense = {
    id: string;
    description: string;
    amount: number;
    paidBy: ExpensePayer[];
    participants: ExpenseParticipant[];
};
type Group = { id: string; name: string; members: Member[]; expenses: Expense[]; };

// --- Enhanced UI Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-4 sm:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_60px_rgba(0,0,0,0.15)] transition-all duration-700 ${className}`}
    >
        {children}
    </motion.div>
);

const Input = ({ value, onChange, placeholder, type = "text", readOnly = false }: { value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, type?: string, readOnly?: boolean }) => (
    <motion.input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        whileFocus={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`w-full px-3 sm:px-6 py-3 sm:py-5 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl text-white placeholder-slate-400/70 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 focus:bg-white/[0.06] transition-all duration-500 ease-out text-overflow-ellipsis overflow-hidden text-sm sm:text-base ${readOnly ? 'bg-white/[0.02] opacity-70' : 'hover:bg-white/[0.06] hover:border-white/[0.12]'}`}
        style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }}
    />
);

const Button = ({ children, onClick, className = "", disabled = false }: { children: React.ReactNode, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void, className?: string, disabled?: boolean }) => (
    <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`w-full bg-white/[0.08] backdrop-blur-xl hover:bg-white/[0.12] text-white font-medium py-3 sm:py-5 px-4 sm:px-7 rounded-2xl transition-all duration-500 border border-white/[0.08] hover:border-white/[0.15] flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] text-sm sm:text-base ${className}`}
    >
        {children}
    </motion.button>
);

// --- Fixed Custom Select Component ---
const CustomSelect: React.FC<{ options: { value: string; label: string; icon?: React.ReactNode }[]; value: string | null; onChange: (value: string) => void; placeholder?: string; }> = ({ options, value, onChange, placeholder = 'Select...' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    useEffect(() => {
        const handleScrollOrResize = () => {
            if (isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize);
        return () => {
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={selectRef}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full px-3 sm:px-6 py-3 sm:py-5 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-500 text-left flex items-center justify-between hover:bg-white/[0.06] hover:border-white/[0.12] overflow-hidden text-sm sm:text-base"
            >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {selectedOption?.icon}
                    <span className={`${selectedOption ? 'text-white' : 'text-slate-400/70'} truncate`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                    className="text-white/60 flex-shrink-0 ml-2"
                >
                    <ChevronDown size={18} />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.4)] overflow-hidden z-50"
                    >
                        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            {options.map((option, index) => {
                                const isSelected = option.value === value;
                                return (
                                    <motion.div
                                        key={option.value}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.4 }}
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`px-3 sm:px-6 py-3 sm:py-4 cursor-pointer transition-all duration-300 flex items-center justify-between group ${isSelected ? 'bg-white/20 text-white border-l-4 border-l-cyan-400' : 'text-white/90 hover:bg-white/15 hover:text-white'}`}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                            {option.icon}
                                            <span className="font-medium truncate text-sm sm:text-base">{option.label}</span>
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -90 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
                                                className="text-cyan-400 flex-shrink-0 ml-2"
                                            >
                                                <Check size={14} />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Chart Component ---
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl"
            >
                <p className="text-white text-sm font-medium">{data.name}: ₹{data.value.toFixed(2)}</p>
            </motion.div>
        );
    }
    return null;
};

const SummaryChart = ({ data }: { data: { name: string, value: number }[] }) => {
    const COLORS = ['#06B6D4', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
            style={{ width: '100%', height: 200 }}
            className="mb-6"
        >
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        startAngle={90}
                        endAngle={450}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                className="focus:outline-none hover:opacity-80 transition-opacity duration-300"
                                stroke="none"
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

// --- Enhanced Modal Components ---
const ConfirmModal: React.FC<{ onConfirm: () => void; onCancel: () => void; }> = ({ onConfirm, onCancel }) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
            />
            <motion.div
                className="relative bg-white/[0.05] backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-6 max-w-sm w-full shadow-[0_20px_80px_rgba(0,0,0,0.3)]"
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            >
                <div className="text-center space-y-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">Reset All Entries?</h2>
                    <p className="text-white/70 leading-relaxed text-sm sm:text-base">This action cannot be undone. All expense data will be permanently deleted.</p>
                    <div className="flex flex-col gap-3">
                        <Button onClick={onConfirm} className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-200 hover:text-white">
                            Confirm Reset
                        </Button>
                        <Button onClick={onCancel} className="bg-white/5 hover:bg-white/10">
                            Cancel
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AlertModal: React.FC<{ message: string; onClose: () => void; }> = ({ message, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <motion.div
                className="relative bg-white/[0.05] backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-6 max-w-sm w-full shadow-[0_20px_80px_rgba(0,0,0,0.3)]"
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
            >
                <div className="text-center space-y-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">Information</h2>
                    <p className="text-white/70 leading-relaxed text-sm sm:text-base">{message}</p>
                    <Button onClick={onClose}>OK</Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Groups List Page Component ---
const GroupsListPage: React.FC<{ groups: Group[]; onSelectGroup: (id: string) => void; onUpdateGroups: (groups: Group[]) => void; showAlert: (message: string) => void; }> = ({ groups, onSelectGroup, onUpdateGroups, showAlert }) => {
    const [newGroupName, setNewGroupName] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

    const handleAddGroup = () => {
        if (!newGroupName.trim()) {
            showAlert('Please enter a group name.');
            return;
        }

        const duplicateExists = groups.some(group =>
            group.name.toLowerCase() === newGroupName.trim().toLowerCase()
        );

        if (duplicateExists) {
            showAlert('A group with this name already exists. Please choose a different name.');
            return;
        }

        const newGroup: Group = { id: crypto.randomUUID(), name: newGroupName.trim(), members: [], expenses: [] };
        onUpdateGroups([...groups, newGroup]);
        setNewGroupName('');
    };

    const handleDeleteClick = (group: Group) => {
        setGroupToDelete(group);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (groupToDelete) {
            onUpdateGroups(groups.filter(g => g.id !== groupToDelete.id));
        }
        setIsDeleteModalOpen(false);
        setGroupToDelete(null);
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setGroupToDelete(null);
    };

    return (
        <>
            <div className="space-y-8 sm:space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                    className="text-center space-y-3 sm:space-y-4"
                >
                    <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight">Your Groups</h1>
                    <p className="text-white/60 text-base sm:text-lg">Select a group or create a new one</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                >
                    <Card>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                            <div className="flex-grow">
                                <Input
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    placeholder="New group name (e.g., Goa Trip)"
                                />
                            </div>
                            <div className="flex-shrink-0">
                                <Button onClick={handleAddGroup} className="w-full sm:w-auto sm:h-full sm:px-8">
                                    <Plus size={18} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                >
                    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-4 sm:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                        <AnimatePresence mode="wait">
                            {groups.length > 0 ? (
                                <motion.div
                                    key="list-view"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                                >
                                    <div className="space-y-3 sm:space-y-4">
                                        <AnimatePresence>
                                            {groups.map((group) => (
                                                <motion.div
                                                    key={group.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeOut" } }}
                                                    transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                                                    className="group relative bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                                                    onClick={() => onSelectGroup(group.id)}
                                                >
                                                    <div className="flex items-center justify-between p-4 sm:p-7">
                                                        <div className="flex items-center gap-3 sm:gap-5 flex-grow min-w-0">
                                                            <div className="flex-shrink-0 p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-all duration-500">
                                                                <Users size={20} className="sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-colors duration-500" />
                                                            </div>
                                                            <div className="flex-grow min-w-0">
                                                                <h3 className="text-white font-medium text-lg sm:text-xl leading-tight truncate">
                                                                    {group.name}
                                                                </h3>
                                                                <p className="text-white/50 mt-1 sm:mt-2 group-hover:text-white/70 transition-colors duration-500 text-sm sm:text-base">
                                                                    {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <motion.button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(group);
                                                            }}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="flex-shrink-0 p-2 sm:p-3 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl hover:bg-red-500/20 hover:text-red-300"
                                                        >
                                                            <X size={16} className="sm:w-5 sm:h-5" />
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty-view"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                                    className="flex items-center justify-center min-h-[200px]"
                                >
                                    <div className="text-center space-y-4 sm:space-y-6">
                                        <div className="flex justify-center">
                                            <div className="p-4 sm:p-6 bg-white/5 rounded-full border border-white/10">
                                                <FolderPlus size={40} className="sm:w-14 sm:h-14 text-white/40" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 sm:space-y-3">
                                            <h3 className="text-white/80 text-xl sm:text-2xl font-medium">No groups yet</h3>
                                            <p className="text-white/50 max-w-xs mx-auto leading-relaxed text-sm sm:text-base">
                                                Create your first group to start tracking shared expenses
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isDeleteModalOpen && (
                    <ConfirmModal onConfirm={confirmDelete} onCancel={cancelDelete} />
                )}
            </AnimatePresence>
        </>
    );
};

// --- Group Details Page Component ---
const GroupDetailsPage: React.FC<{ group: Group; onUpdateGroup: (group: Group) => void; onGoBack: () => void; showAlert: (message: string) => void; }> = ({ group, onUpdateGroup, onGoBack, showAlert }) => {
    if (!group || !group.members) { return null; }
    const { members, expenses } = group;

    // Expense Form State
    const [newMemberName, setNewMemberName] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState<string>('');
    const [payers, setPayers] = useState<ExpensePayer[]>([]);

    // State for different split methods
    const [splitMethod, setSplitMethod] = useState<'equally' | 'amount'>('equally');
    const [equalParticipantIds, setEqualParticipantIds] = useState<string[]>(members.map(m => m.id));
    const [amountParticipants, setAmountParticipants] = useState<{ [key: string]: string }>(() => {
        const initialState: { [key: string]: string } = {};
        members.forEach(m => { initialState[m.id] = '' });
        return initialState;
    });

    // Validation for "by amount" mode
    const totalAmountSplit = Object.values(amountParticipants).reduce((sum, current) => sum + (parseFloat(current) || 0), 0);
    const isAmountSplitValid = Math.abs(totalAmountSplit - (parseFloat(expenseAmount) || 0)) < 0.01;

    // Validation for payers
    const totalPaid = payers.reduce((sum, payer) => sum + payer.amount, 0);
    const isPayersValid = Math.abs(totalPaid - (parseFloat(expenseAmount) || 0)) < 0.01;

    // Summary State
    const [total, setTotal] = useState<number | null>(null);
    const [summary, setSummary] = useState<{ message: string; type: string; }[]>([]);
    const [settlements, setSettlements] = useState<string[]>([]);
    const [copyStatus, setCopyStatus] = useState('Copy');
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    useEffect(() => {
        setEqualParticipantIds(members.map(m => m.id));
        if (members.length > 0 && payers.length === 0) {
            setPayers([{ memberId: members[0].id, amount: 0 }]);
        }
    }, [members]);

    const updateMembers = (newMembers: Member[]) => {
        const memberIds = newMembers.map(m => m.id);
        const updatedExpenses = group.expenses.filter(e =>
            e.paidBy.every(p => memberIds.includes(p.memberId)) &&
            e.participants.every(p => memberIds.includes(p.memberId))
        );
        onUpdateGroup({ ...group, members: newMembers, expenses: updatedExpenses });
    };

    const updateExpenses = (newExpenses: Expense[]) => {
        onUpdateGroup({ ...group, expenses: newExpenses });
    };

    const handleAddMember = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!newMemberName.trim() || members.some(m => m.name.toLowerCase() === newMemberName.trim().toLowerCase())) {
            showAlert('Please enter a unique member name.');
            return;
        }
        const newMember: Member = { id: crypto.randomUUID(), name: newMemberName.trim() };
        updateMembers([...members, newMember]);
        setNewMemberName('');
    };

    const handleDeleteMember = (idToDelete: string) => {
        updateMembers(members.filter(m => m.id !== idToDelete));
    };

    const addPayer = () => {
        const availableMembers = members.filter(m => !payers.some(p => p.memberId === m.id));
        if (availableMembers.length > 0) {
            setPayers([...payers, { memberId: availableMembers[0].id, amount: 0 }]);
        }
    };

    const removePayer = (index: number) => {
        if (payers.length > 1) {
            setPayers(payers.filter((_, i) => i !== index));
        }
    };

    const updatePayer = (index: number, field: 'memberId' | 'amount', value: string | number) => {
        const updated = [...payers];
        if (field === 'memberId') {
            updated[index].memberId = value as string;
        } else {
            updated[index].amount = parseFloat(value as string) || 0;
        }
        setPayers(updated);
    };

    const handleAddExpense = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const numericAmount = parseFloat(expenseAmount);
        if (!expenseDescription.trim() || numericAmount <= 0) {
            showAlert('Please fill out Description and Amount fields.');
            return;
        }

        if (!isPayersValid || payers.length === 0) {
            showAlert('Please ensure the total paid amount matches the expense amount.');
            return;
        }

        let participants: ExpenseParticipant[] = [];
        if (splitMethod === 'equally') {
            if (equalParticipantIds.length === 0) {
                showAlert('Please select at least one participant for an equal split.');
                return;
            }
            const share = numericAmount / equalParticipantIds.length;
            participants = equalParticipantIds.map(id => ({ memberId: id, share: share }));
        } else {
            if (!isAmountSplitValid) {
                showAlert('The sum of individual shares must match the total expense amount.');
                return;
            }
            participants = Object.entries(amountParticipants).map(([memberId, amountStr]) => ({ memberId, share: parseFloat(amountStr) || 0 })).filter(p => p.share > 0);
            if (participants.length === 0) {
                showAlert('Please specify a share for at least one participant.');
                return;
            }
        }

        const newExpense: Expense = {
            id: crypto.randomUUID(),
            description: expenseDescription.trim(),
            amount: numericAmount,
            paidBy: [...payers],
            participants
        };
        updateExpenses([...expenses, newExpense]);

        setExpenseDescription('');
        setExpenseAmount('');
        setPayers([{ memberId: members[0]?.id || '', amount: 0 }]);
        const clearedAmounts: { [key: string]: string } = {};
        members.forEach(m => { clearedAmounts[m.id] = '' });
        setAmountParticipants(clearedAmounts);
        setEqualParticipantIds(members.map(m => m.id));
    };

    const handleDeleteExpense = (idToDelete: string) => {
        updateExpenses(expenses.filter(e => e.id !== idToDelete));
    };

    const handleEqualParticipantToggle = (memberId: string) => {
        setEqualParticipantIds(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);
    };

    const handleAmountParticipantChange = (memberId: string, value: string) => {
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmountParticipants(prev => ({ ...prev, [memberId]: value }));
        }
    };

    const calculate = () => {
        if (members.length < 1 || expenses.length === 0) {
            setTotal(null);
            setSummary([]);
            setSettlements([]);
            return;
        }
        const memberBalances: { [key: string]: number } = {};
        members.forEach(m => memberBalances[m.id] = 0);

        expenses.forEach(expense => {
            expense.paidBy.forEach(payer => {
                memberBalances[payer.memberId] += payer.amount;
            });
            expense.participants.forEach(participant => {
                memberBalances[participant.memberId] -= participant.share;
            });
        });

        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        setTotal(totalSpent);
        const finalBalances = members.map(m => ({ id: m.id, name: m.name, balance: memberBalances[m.id] }));
        const summaryMessages = finalBalances.map(p => {
            if (p.balance > 0.01) return { message: `${p.name} is owed ₹${p.balance.toFixed(2)}`, type: 'owed' };
            if (p.balance < -0.01) return { message: `${p.name} owes ₹${Math.abs(p.balance).toFixed(2)}`, type: 'owes' };
            return { message: `${p.name} is settled`, type: 'settled' };
        });
        setSummary(summaryMessages);
        calculateSettlements(finalBalances);
    };

    useEffect(() => { calculate(); }, [expenses, members]);

    const calculateSettlements = (balances: { id: string, name: string; balance: number; }[]) => {
        let debtors = JSON.parse(JSON.stringify(balances.filter(p => p.balance < 0)));
        let creditors = JSON.parse(JSON.stringify(balances.filter(p => p.balance > 0)));
        const settlementSteps: string[] = [];
        while (debtors.length > 0 && creditors.length > 0) {
            let debtor = debtors[0];
            let creditor = creditors[0];
            const amountToPay = Math.min(Math.abs(debtor.balance), creditor.balance);
            settlementSteps.push(`${debtor.name} pays ${creditor.name} ₹${amountToPay.toFixed(2)}`);
            debtor.balance += amountToPay;
            creditor.balance -= amountToPay;
            if (Math.abs(debtor.balance) < 0.01) debtors.shift();
            if (creditor.balance < 0.01) creditors.shift();
        }
        setSettlements(settlementSteps);
    };

    const reset = () => { updateExpenses([]); };

    const handleCopy = () => {
        const report = `*${group.name} - Summary*\n\nTotal Spent: ₹${total?.toFixed(2)}\n\n*Settlements:*\n${settlements.map(step => `- ${step}`).join('\n')}`;
        const textArea = document.createElement('textarea');
        textArea.value = report;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopyStatus('Failed!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        }
        document.body.removeChild(textArea);
    };

    // Animation variants for the list and items
    const listContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07,
            },
        },
    };

    const listItemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    };

    return (
        <div className="space-y-8 sm:space-y-12 pb-8 sm:pb-12">
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                className="text-center space-y-4 sm:space-y-6"
            >
                <motion.button
                    onClick={onGoBack}
                    whileHover={{ x: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2 sm:gap-3 text-cyan-400 hover:text-cyan-300 transition-all duration-300 mx-auto group text-sm sm:text-base"
                >
                    <ArrowLeft size={16} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Groups
                </motion.button>
                <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-light tracking-tight">{group.name}</h1>
                <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full" />
            </motion.div>

            <Card>
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10">
                        <Users size={24} className="sm:w-7 sm:h-7 text-white/70" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl text-white font-medium">Members</h2>
                    <div className="text-white/50 bg-white/5 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {members.length}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-6 sm:mb-8">
                    <div className="flex-grow">
                        <Input
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="New member name (e.g., Arun)"
                        />
                    </div>
                    <Button onClick={handleAddMember} className="w-full sm:w-auto sm:px-8 sm:h-full">
                        <Plus size={18} />
                    </Button>
                </div>

                {/* --- START: STRUCTURAL FIX FOR MEMBER LIST ANIMATION --- */}
                <motion.div layout transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }} className="relative min-h-[96px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {members.length === 0 ? (
                            <motion.div
                                key="empty-members"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center text-center text-white/50 text-base sm:text-lg"
                            >
                                Add members to get started
                            </motion.div>
                        ) : (
                            <motion.div
                                key="members-list"
                                variants={listContainerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="flex flex-wrap gap-3 sm:gap-4"
                            >
                                <AnimatePresence>
                                    {members.map((member) => (
                                        <motion.div
                                            key={member.id}
                                            layout
                                            variants={listItemVariants}
                                            transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                                            className="group contents" // Use contents to avoid adding an extra div to the flex layout
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] rounded-xl px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-4 transition-all duration-500 hover:bg-white/[0.08]"
                                            >
                                                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">
                                                    <User size={14} className="sm:w-4 sm:h-4 text-white/70" />
                                                </div>
                                                <span className="text-white font-medium text-sm sm:text-base">{member.name}</span>
                                                <motion.button
                                                    onClick={() => handleDeleteMember(member.id)}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-1 sm:p-1.5 text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 rounded-lg"
                                                >
                                                    <X size={12} className="sm:w-3.5 sm:h-3.5" />
                                                </motion.button>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                {/* --- END: STRUCTURAL FIX FOR MEMBER LIST ANIMATION --- */}

            </Card>

            <Card>
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-white/70 text-xl sm:text-2xl font-bold">₹</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl text-white font-medium">Add New Expense</h2>
                </div>

                <div className="grid gap-6 sm:gap-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="text-white/80 font-medium mb-2 sm:mb-3 block text-sm sm:text-base">Description</label>
                            <Input
                                value={expenseDescription}
                                onChange={(e) => setExpenseDescription(e.target.value)}
                                placeholder="e.g., Dinner at restaurant"
                            />
                        </div>
                        <div>
                            <label className="text-white/80 font-medium mb-2 sm:mb-3 block text-sm sm:text-base">Amount</label>
                            <Input
                                type="number"
                                value={expenseAmount}
                                onChange={(e) => {
                                    setExpenseAmount(e.target.value);
                                    if (payers.length === 1) {
                                        const amount = parseFloat(e.target.value) || 0;
                                        setPayers([{ ...payers[0], amount }]);
                                    }
                                }}
                                placeholder="₹ 0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-white/80 font-medium mb-3 sm:mb-4 block text-sm sm:text-base">Paid by</label>
                        <div className="space-y-3 sm:space-y-4">
                            <AnimatePresence>
                                {payers.map((payer, index) => {
                                    const availableMembers = members.filter(m =>
                                        m.id === payer.memberId || !payers.some(p => p.memberId === m.id)
                                    );

                                    return (
                                        <motion.div
                                            key={`payer-${index}`}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.4 }}
                                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl"
                                        >
                                            <div className="flex-grow">
                                                <CustomSelect
                                                    options={availableMembers.map(m => ({
                                                        value: m.id,
                                                        label: m.name,
                                                        icon: <User size={16} />
                                                    }))}
                                                    value={payer.memberId}
                                                    onChange={(memberId) => updatePayer(index, 'memberId', memberId)}
                                                    placeholder="Select who paid"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-full sm:w-32">
                                                    <Input
                                                        type="number"
                                                        value={payer.amount.toString()}
                                                        onChange={(e) => updatePayer(index, 'amount', e.target.value)}
                                                        placeholder="₹ 0.00"
                                                    />
                                                </div>
                                                {payers.length > 1 && (
                                                    <motion.button
                                                        onClick={() => removePayer(index)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                                                    >
                                                        <X size={16} />
                                                    </motion.button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {members.filter(m => !payers.some(p => p.memberId === m.id)).length > 0 && (
                                <motion.button
                                    onClick={addPayer}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-3 p-4 text-cyan-400 hover:text-cyan-300 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/30 rounded-2xl transition-all duration-300"
                                >
                                    <Plus size={16} />
                                    <span className="text-sm sm:text-base">Add another payer</span>
                                </motion.button>
                            )}

                            <div className={`text-center p-3 sm:p-4 rounded-xl transition-all duration-300 text-sm sm:text-base ${(parseFloat(expenseAmount) > 0 && isPayersValid) ? 'text-green-300 bg-green-500/10 border border-green-500/20' : 'text-yellow-300 bg-yellow-500/10 border border-yellow-500/20'}`}>
                                Total paid: ₹{totalPaid.toFixed(2)} / ₹{(parseFloat(expenseAmount) || 0).toFixed(2)}
                                {parseFloat(expenseAmount) > 0 && !isPayersValid && (
                                    <div className="text-xs mt-1 opacity-80">
                                        Remaining: ₹{Math.abs(totalPaid - (parseFloat(expenseAmount) || 0)).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-white/80 font-medium mb-3 sm:mb-4 block text-sm sm:text-base">Split between</label>
                        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl">
                            <button
                                onClick={() => setSplitMethod('equally')}
                                className={`w-1/2 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${splitMethod === 'equally' ? 'bg-white/10 text-white shadow-lg' : 'text-white/60 hover:bg-white/5'}`}
                            >
                                Equally
                            </button>
                            <button
                                onClick={() => setSplitMethod('amount')}
                                className={`w-1/2 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${splitMethod === 'amount' ? 'bg-white/10 text-white shadow-lg' : 'text-white/60 hover:bg-white/5'}`}
                            >
                                By Amount
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {splitMethod === 'equally' ? (
                                <motion.div
                                    key="equally"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                                    className="space-y-2 sm:space-y-3"
                                >
                                    {members.map((member, index) => {
                                        const isSelected = equalParticipantIds.includes(member.id);
                                        return (
                                            <motion.div
                                                key={member.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                                onClick={() => handleEqualParticipantToggle(member.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex items-center gap-3 sm:gap-5 p-3 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${isSelected ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/15' : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]'}`}
                                            >
                                                <div className={`relative w-5 sm:w-6 h-5 sm:h-6 rounded-lg border-2 flex-shrink-0 transition-all duration-300 ${isSelected ? 'bg-cyan-400 border-cyan-400' : 'border-white/30'}`}>
                                                    <AnimatePresence>
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ scale: 0, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                exit={{ scale: 0, opacity: 0 }}
                                                                className="absolute inset-0 flex items-center justify-center"
                                                            >
                                                                <Check size={12} className="sm:w-3.5 sm:h-3.5 text-white" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4 flex-grow">
                                                    <User size={16} className="sm:w-5 sm:h-5 text-white/50" />
                                                    <span className={`font-medium transition-colors text-sm sm:text-base ${isSelected ? 'text-white' : 'text-white/80'}`}>
                                                        {member.name}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="amount"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                                    className="space-y-2 sm:space-y-3"
                                >
                                    {members.map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-5 p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
                                        >
                                            <div className="flex items-center gap-2 sm:gap-4 flex-grow p-1 sm:p-3">
                                                <User size={16} className="sm:w-5 sm:h-5 text-white/50" />
                                                <span className="font-medium text-white/80 text-sm sm:text-base">{member.name}</span>
                                            </div>
                                            <div className="w-full sm:w-32">
                                                <Input
                                                    type="number"
                                                    value={amountParticipants[member.id] || ''}
                                                    onChange={(e) => handleAmountParticipantChange(member.id, e.target.value)}
                                                    placeholder="₹ 0.00"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div className={`mt-4 sm:mt-6 text-center p-3 sm:p-4 rounded-xl transition-all duration-300 text-sm sm:text-base ${(parseFloat(expenseAmount) > 0 && isAmountSplitValid) ? 'text-green-300 bg-green-500/10' : 'text-yellow-300 bg-yellow-500/10'}`}>
                                        Total of shares: ₹{totalAmountSplit.toFixed(2)} / ₹{(parseFloat(expenseAmount) || 0).toFixed(2)}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button
                        onClick={handleAddExpense}
                        disabled={
                            members.length === 0 ||
                            !isPayersValid ||
                            payers.length === 0 ||
                            (splitMethod === 'amount' && !isAmountSplitValid) ||
                            parseFloat(expenseAmount) <= 0
                        }
                    >
                        <Plus size={18} /> Add Expense
                    </Button>
                </div>
            </Card>

            {expenses.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                >
                    <Card>
                        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10">
                                <Calculator size={24} className="sm:w-7 sm:h-7 text-white/70" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl text-white font-medium">Expense Log</h2>
                            <div className="text-white/50 bg-white/5 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                {expenses.length}
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4 overflow-hidden">
                            <AnimatePresence>
                                {expenses.map((expense, index) => {
                                    const payerNames = expense.paidBy.map(p => {
                                        const member = members.find(m => m.id === p.memberId);
                                        return member ? `${member.name} (₹${p.amount})` : '';
                                    }).filter(Boolean).join(', ');

                                    return (
                                        <motion.div
                                            key={expense.id}
                                            layout
                                            initial={{ opacity: 0, x: -30, scale: 0.95 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                                            transition={{
                                                delay: index * 0.05,
                                                duration: 0.4,
                                                ease: [0.4, 0.0, 0.2, 1]
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            className="group bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-4 sm:p-6 transition-all duration-500 hover:bg-white/[0.06]"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                                                        <span className="text-white/50 p-1.5 sm:p-2 bg-white/5 rounded-lg">
                                                            <Receipt size={14} className="sm:w-4 sm:h-4" />
                                                        </span>
                                                        <h3 className="text-white font-medium text-lg sm:text-xl">{expense.description}</h3>
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-white/60 text-sm sm:text-base">
                                                        <span>Paid by <span className="text-cyan-400 font-medium">{payerNames}</span></span>
                                                        <span>Split between {expense.participants.length} people</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5">
                                                    <div className="text-left sm:text-right">
                                                        <div className="text-white font-semibold text-xl sm:text-2xl">₹{expense.amount.toFixed(2)}</div>
                                                    </div>
                                                    <motion.button
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 sm:p-3 text-red-400 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 rounded-xl hover:text-red-300 flex-shrink-0"
                                                    >
                                                        <X size={16} className="sm:w-5 sm:h-5" />
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="mt-4 sm:mt-6 border-t border-white/10 pt-3 sm:pt-5 space-y-2 sm:space-y-3">
                                                <h4 className="text-white/80 font-medium text-sm sm:text-base">Individual Shares:</h4>
                                                {expense.participants.map(p => {
                                                    const member = members.find(m => m.id === p.memberId);
                                                    return member ? (
                                                        <div key={p.memberId} className="flex justify-between items-center text-white/70 text-sm sm:text-base">
                                                            <span>{member.name}</span>
                                                            <span className="text-white font-medium">₹{p.share.toFixed(2)}</span>
                                                        </div>
                                                    ) : null
                                                })}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {expenses.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex justify-center"
                            >
                                <motion.button
                                    onClick={() => setIsResetModalOpen(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 sm:gap-3 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 text-sm sm:text-base flex-shrink-0 min-w-fit whitespace-nowrap"
                                >
                                    <RefreshCw size={16} className="sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Reset All Expenses</span>
                                    <span className="sm:hidden">Reset All</span>
                                </motion.button>
                            </motion.div>
                        )}
                    </Card>
                </motion.div>
            )}

            {summary.length > 0 && total !== null && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                >
                    <Card>
                        <h2 className="text-2xl sm:text-3xl text-white mb-6 sm:mb-8 font-medium">Summary</h2>

                        <SummaryChart data={members.map(m => ({
                            name: m.name,
                            value: expenses.reduce((sum, e) => {
                                const paidAmount = e.paidBy.find(p => p.memberId === m.id)?.amount || 0;
                                return sum + paidAmount;
                            }, 0)
                        }))} />

                        <div className='text-center text-white/70 mt-6 sm:mt-8 mb-6 sm:mb-8 border-b border-white/10 pb-6 sm:pb-8'>
                            <span className="text-base sm:text-lg">Total Spent: </span>
                            <span className="font-semibold text-white text-2xl sm:text-3xl">₹{total.toFixed(2)}</span>
                        </div>

                        <div className="grid gap-3 sm:gap-4">
                            {summary.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-colors border ${item.type === 'owed' ? 'bg-green-500/10 border-green-500/20' : item.type === 'owes' ? 'bg-red-500/10 border-red-500/20' : 'bg-white/[0.04] border-white/[0.08]'}`}
                                >
                                    <div className={`w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full ${item.type === 'owed' ? 'bg-green-400' : item.type === 'owes' ? 'bg-red-400' : 'bg-white/40'}`} />
                                    <span className={`text-base sm:text-lg ${item.type === 'owed' ? 'text-green-400' : item.type === 'owes' ? 'text-red-400' : 'text-white/60'}`}>
                                        {item.message}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            {settlements.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                >
                    <Card>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl text-white font-medium">Settlements</h2>
                            <motion.button
                                onClick={handleCopy}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 sm:gap-3 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-300 border border-cyan-500/20 self-start sm:self-auto flex-shrink-0 min-w-fit whitespace-nowrap text-sm sm:text-base"
                            >
                                <Copy size={14} className="sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{copyStatus}</span>
                                <span className="sm:hidden">{copyStatus === 'Copy' ? 'Copy' : '✓'}</span>
                            </motion.button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {settlements.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                    className="flex items-center gap-3 sm:gap-5 text-cyan-300 p-4 sm:p-5 bg-cyan-900/20 rounded-2xl border border-cyan-500/20 hover:bg-cyan-900/30 transition-colors duration-300"
                                >
                                    <ArrowRight size={20} className="sm:w-6 sm:h-6 text-cyan-500 flex-shrink-0" />
                                    <span className="text-base sm:text-lg">{step}</span>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            <AnimatePresence>
                {isResetModalOpen && (
                    <ConfirmModal
                        onConfirm={() => { reset(); setIsResetModalOpen(false); }}
                        onCancel={() => setIsResetModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// =====================================================================
// THE MAIN APP COMPONENT
// =====================================================================

function App() {
    const [groups, setGroups] = useState<Group[]>(() => {
        try {
            const savedGroups = localStorage.getItem('expenseSplitterGroups');
            if (savedGroups) {
                const parsedGroups = JSON.parse(savedGroups);
                return parsedGroups.map((group: any) => ({
                    id: group.id || crypto.randomUUID(),
                    name: group.name || 'Untitled Group',
                    members: group.members || [],
                    expenses: group.expenses ? group.expenses.map((exp: any) => ({
                        id: exp.id,
                        description: exp.description,
                        amount: exp.amount,
                        paidBy: exp.paidBy || (exp.paidById ? [{ memberId: exp.paidById, amount: exp.amount }] : []),
                        participants: exp.participants || []
                    })) : [],
                }));
            }
            return [];
        } catch (error) {
            console.error("Failed to parse groups from localStorage", error);
            return [];
        }
    });

    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        try {
            localStorage.setItem('expenseSplitterGroups', JSON.stringify(groups));
        } catch (error) {
            console.error("Failed to save groups to localStorage", error);
        }
        if (selectedGroupId && !groups.some(g => g.id === selectedGroupId)) {
            setSelectedGroupId(null);
        }
    }, [groups, selectedGroupId]);

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setIsAlertOpen(true);
    };

    const closeAlert = () => {
        setIsAlertOpen(false);
        setAlertMessage('');
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen w-full p-3 sm:p-6 md:p-10 flex flex-col items-center relative font-light">
            <div className="fixed inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url(/noise.png)', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />

            <div className="w-full max-w-lg sm:max-w-2xl space-y-6 sm:space-y-8 relative z-10">
                <AnimatePresence mode="wait">
                    {selectedGroup ? (
                        <GroupDetailsPage
                            key={selectedGroup.id}
                            group={selectedGroup}
                            onUpdateGroup={(updatedGroup) => {
                                setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
                            }}
                            onGoBack={() => setSelectedGroupId(null)}
                            showAlert={showAlert}
                        />
                    ) : (
                        <GroupsListPage
                            groups={groups}
                            onSelectGroup={(id) => setSelectedGroupId(id)}
                            onUpdateGroups={setGroups}
                            showAlert={showAlert}
                        />
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isAlertOpen && (
                    <AlertModal
                        message={alertMessage}
                        onClose={closeAlert}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
