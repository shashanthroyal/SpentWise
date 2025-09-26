import { useEffect , useState } from "react"
import API from "../api"
import { useNavigate } from "react-router-dom";
import { PieChart , Pie , Cell , Tooltip  , Legend , ResponsiveContainer } from 'recharts';
import Loader from "../components/Loader";
import './Dashboard.css'
import logo from '../assets/logo.png';

function Navbar({ user, onLogout }) {
    return (
        <div className="dashboard-navbar">
            <div className="dashboard-navbar-title">
                <img src={logo} alt="Logo"  />
                <h2 >SpentWise</h2>
            </div>
            <div className="dashboard-navbar-user">
                <span>Hi, {user?.name || 'User'}</span>
                <button className="dashboard-navbar-logout" onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
}

export default function Dashboard(){
    
    const [ expenses , setExpenses] = useState([]);
    const [filteredExpenses , setFilteredExpenses ] = useState([]);
    const [form , setForm ] = useState({title: "", amount: "", category: ""});
    const [filters , setFilters ] = useState({start:"" , end: ""});
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
        else fetchExpenses();
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch {
                setUser(null);
            }
        }
    }, []);

    useEffect(() => {
        setFilteredExpenses(expenses);
    }, [expenses]);

    const fetchExpenses = async () => {
        try {
            const token = localStorage.getItem("token");
            setLoading(true);
            const { data } = await API.get("/expenses", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(data);
        } catch (error) {
            alert("Failed to fetch expenses.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await API.post("expenses", form);
            setForm({ title: "", amount: "", category: "" });
            fetchExpenses();
        } catch (error) {
            alert("Failed to add expenses");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense?")) return;
        try {
            await API.delete(`/expenses/${id}`);
            fetchExpenses();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        let filtered = expenses;
        if (filters.start) {
            filtered = filtered.filter(exp => new Date(exp.date) >= new Date(filters.start));
        }
        if (filters.end) {
            filtered = filtered.filter(exp => new Date(exp.date) <= new Date(filters.end));
        }
        setFilteredExpenses(filtered);
    };

    const total = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const categories = [...new Set(expenses.map(exp => exp.category))];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FE6E8E'];
    const chartData = categories.map((cat) => ({
        name: cat,
        value: filteredExpenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + Number(exp.amount), 0)
    }));

    return (
        <div className="dashboard-bg">
            <Navbar user={user} onLogout={handleLogout} />
            {loading ? (
                <Loader />
            ) : (
                <div className="dashboard-main">
                    <div className="dashboard-content">
                        <h2 style={{fontSize: 28, fontWeight: 700, marginBottom: 24, textAlign: 'center'}}>Dashboard</h2>
                        {/* Summary */}
                        <h3 style={{fontSize: 20, fontWeight: 600, marginBottom: 16, textAlign: 'center'}}>Total Spent: <span style={{color: '#2563eb'}}>{total}</span></h3>
                        {/* Date Filters */}
                        <div className="dashboard-filters">
                            <input type="date" name="start" value={filters.start} onChange={handleFilterChange} />
                            <input type="date" name="end" value={filters.end} onChange={handleFilterChange} />
                            <button className="dashboard-filter-btn" onClick={applyFilters}>Apply Filters</button>
                        </div>
                        {/* Add Expense Form */}
                        <form className="dashboard-expense-form" onSubmit={handleAddExpense}>
                            <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                            <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
                            <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
                            <button className="dashboard-add-btn" type="submit">Add</button>
                        </form>
                        {/* Pie Chart */}
                        <div className="dashboard-chart">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Expense List */}
                        <div className="dashboard-table-wrap">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Amount</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExpenses.length > 0 ? (
                                        filteredExpenses.map((exp) => (
                                            <tr key={exp._id}>
                                                <td>{exp.title}</td>
                                                <td>{exp.amount}</td>
                                                <td>{exp.category}</td>
                                                <td>{new Date(exp.date).toLocaleDateString()}</td>
                                                <td><button className="dashboard-delete-btn" onClick={() => handleDelete(exp._id)}>Delete</button></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{textAlign: 'center', padding: 16}}>No expenses found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}