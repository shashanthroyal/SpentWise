import { useEffect , useState } from "react"
import API from "../api"
import { useNavigate } from "react-router-dom";
import { PieChart , Pie , Cell , Tooltip  , Legend , ResponsiveContainer } from 'recharts';
import Loader from "../components/Loader";

function Navbar({ user, onLogout }) {
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', background: '#2563eb', color: '#fff', borderRadius: 20, marginBottom: 24}}>
            <div style={{fontWeight: 600, fontSize: 22 , paddingLeft: 80}}>SpentWise</div>
            <div style={{display: 'flex', alignItems: 'center', paddingRight: 80 , gap: 25}}>
                <span style={{fontWeight: 500}}>Hi, {user?.name || 'User'}</span>
                <button onClick={onLogout} style={{background: '#fff', color: '#2563eb', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer'}}>Logout</button>
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
    const [loading, setLoading] = useState(true);

   const navigate = useNavigate();

     useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token) navigate("/login");
        else fetchExpenses();
        // Get user info from localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch {
                setUser(null);
            }
        }
     }, []);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

     // Keep filteredExpenses in sync with expenses unless filters are applied
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
        console.log(error)
        alert("Failed to fetch expenses.")
    }finally{
        setLoading(false);
    }
   };

   const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

   const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
        await API.post("expenses", form);
        setForm({title: "", amount: "", category: ""});
        fetchExpenses();
    } catch (error) {
        alert("Failed to add expenses" , error.message)
    }
   };

    const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      alert("Failed to delete" , err);
    }
  };

    const handleFilterChange = (e) => {
        setFilters({...filters , [e.target.name] : e.target.value});
    }

    const applyFilters = () => {
        let filtered = expenses
        if(filters.start){
            filtered = filtered.filter(exp => new Date(exp.date) >= new Date(filters.start));
        }
     if(filters.end){
            filtered = filtered.filter(exp => new Date(exp.date) <= new Date(filters.end));
        }   
        setFilteredExpenses(filtered);
    }

    const total = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    const categories = [...new Set(expenses.map(exp => exp.category))];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FE6E8E'];
    const chartData = categories.map((cat) => ({
            name: cat,
            value: filteredExpenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + Number(exp.amount), 0)
        }));

    return(
        <div style={{minHeight: '100vh', background: '#f3f4f6'}}>
            <Navbar user={user} onLogout={handleLogout} />

            {loading ? ( <Loader />
            ) : (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 80px)'}}>
                <div style={{width: '100%', maxWidth: 900, margin: '40px 0', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0001'}}>
                    <h2 style={{fontSize: 28, fontWeight: 700, marginBottom: 24, textAlign: 'center'}}>Dashboard</h2>

                {/* Summary */}
                <h3 style={{fontSize: 20, fontWeight: 600, marginBottom: 16, textAlign: 'center'}}>Total Spent: <span style={{color: '#2563eb'}}>₹{total}</span></h3>

                {/* Date Filters */}
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24, justifyContent: 'center', alignItems: 'center'}}>
                    <input type="date" name="start" value={filters.start} onChange={handleFilterChange} style={{border: '1px solid #ccc', padding: 8, borderRadius: 8}} />
                    <input type="date" name="end" value={filters.end} onChange={handleFilterChange} style={{border: '1px solid #ccc', padding: 8, borderRadius: 8}} />
                    <button onClick={applyFilters} style={{background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 600}}>Apply Filters</button>
                </div>

                {/* Add Expense Form */}
                <form onSubmit={handleAddExpense} style={{display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32, justifyContent: 'center', alignItems: 'center'}}>
                    <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{border: '1px solid #ccc', padding: 8, borderRadius: 8}}/>
                    <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required style={{border: '1px solid #ccc', padding: 8, borderRadius: 8}}/>
                    <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required style={{border: '1px solid #ccc', padding: 8, borderRadius: 8}}/>
                    <button type="submit" style={{background: '#22c55e', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 600}}>Add</button>
                </form>

                {/* Pie Chart */}
                <div style={{height: 300, marginBottom: 32, background: '#f3f4f6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
                <div style={{overflowX: 'auto'}}>
                    <table style={{minWidth: '100%', background: '#fff', border: '1px solid #eee', borderRadius: 12}}>
                        <thead>
                            <tr style={{background: '#f3f4f6'}}>
                                <th style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}>Title</th>
                                <th style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}>Amount</th>
                                <th style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}>Category</th>
                                <th style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}>Date</th>
                                <th style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length > 0 ? (
                                expenses.map((exp)=>(
                                    <tr key={exp._id} style={{transition: 'background 0.2s'}}>
                                        <td style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}>{exp.title}</td>
                                        <td style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}>{exp.amount}</td>
                                        <td style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}>{exp.category}</td>
                                        <td style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}>{new Date(exp.date).toLocaleDateString()}</td>
                                        <td style={{padding: '8px 16px', borderBottom: '1px solid #eee'}}><button onClick={()=> handleDelete(exp._id)} style={{background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: 6, border: 'none', fontWeight: 600}}>Delete</button></td>
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
    )

}