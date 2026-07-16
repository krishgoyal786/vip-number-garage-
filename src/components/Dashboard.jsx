import { useState } from 'react';
import './Dashboard.css';

const timeSlots = [
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "12:30 PM - 01:00 PM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "03:30 PM - 04:00 PM",
  "04:00 PM - 04:30 PM",
  "04:30 PM - 05:00 PM",
  "05:00 PM - 05:30 PM",
  "05:30 PM - 06:00 PM"
];

const Dashboard = ({ 
  inventory, categories, requests, sellRequests = [], onDeleteSellRequest, 
  onUpdateRequestStatus, onDeleteRequest,
  onUpdateQueryStatus, onDeleteQuery,
  coupons = [], onAddCoupon, onDeleteCoupon,
  activities, onAddNumber, onDeleteNumber, 
  onAddCategory, onDeleteCategory, onUpdateOrderStatus, onDeleteOrder, 
  onUpdateOfferPrice, onBulkUpload, queries, orders,
  consultations = [], onUpdateConsultation, onDeleteConsultation,
  onToggleSoldStatus,
  onDeliverOrder,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [tempUpcs, setTempUpcs] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editSlot, setEditSlot] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: '' });
  
  const filteredInventory = inventory.filter(item => 
    (item.number || '').includes(searchTerm) || 
    (item.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offerZoneNumbers = inventory.filter(item => item.offerPrice > 0 && 
    ((item.number || '').includes(searchTerm) || (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRequests = requests.filter(r => 
    (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (r.phone || '').includes(searchTerm) || (r.pattern || '').includes(searchTerm)
  );

  const filteredSellRequests = sellRequests.filter(sr => 
    (sr.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (sr.phone || '').includes(searchTerm) || (sr.numberToSell || '').includes(searchTerm)
  );

  const filteredCoupons = coupons.filter(c => 
    (c.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQueries = queries.filter(q => 
    !q.message?.includes('Program Type: ') && 
    ((q.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (q.message || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const influencerQueries = queries.filter(q => 
    q.message?.includes('Program Type: INFLUENCER') && 
    ((q.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (q.message || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const businessQueries = queries.filter(q => 
    q.message?.includes('Program Type: BUSINESS') && 
    ((q.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (q.message || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const parsePartnerMessage = (messageText) => {
    if (!messageText) return {};
    const details = {};
    const lines = messageText.split('\n');
    lines.forEach(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.substring(0, idx).trim().toLowerCase();
        const val = line.substring(idx + 1).trim();
        details[key] = val;
      }
    });
    return {
      phone: details['phone'] || '',
      businessName: details['business/channel name'] || '',
      platformLink: details['platform/website link'] || '',
      message: details['message'] || ''
    };
  };

  const handleCreateCouponFromPartner = (partnerName, queryId) => {
    const safeName = (partnerName || '').toString();
    const code = safeName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 10) + '10';
    setNewCoupon({ code, discountPercentage: '10' });
    if (queryId) {
      onUpdateQueryStatus(queryId, 'Resolved');
    }
    setActiveTab('coupons');
  };

  const filteredOrders = orders.filter(o => 
    (o.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.customer?.phone || '').includes(searchTerm) ||
    o.items?.some(i => (i.number || '').includes(searchTerm))
  );

  const filteredConsultations = consultations.filter(c => 
    (c.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm) ||
    (c.bookingSlot || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.placeOfBirth || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivity = activities.filter(a => 
    (a.action || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.details || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newNumber, setNewNumber] = useState({ number: '', price: '', offerPrice: '', category: '', operator: 'Airtel', description: '' });
  const [newCatName, setNewCatName] = useState('');

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newNumber.category) { alert("Select category."); return; }
    
    // Auto-fill description if empty to prevent backend crash
    const numberToSave = {
      ...newNumber,
      description: newNumber.description || `Premium VIP Number: ${newNumber.number}`
    };

    if (await onAddNumber(numberToSave)) {
      setNewNumber({ number: '', price: '', offerPrice: '', category: '', operator: 'Airtel', description: '' });
      alert("Number Added Successfully!");
    }
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    if (await onAddCategory(newCatName)) { setNewCatName(''); alert("Category Added!"); }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (Number(newCoupon.discountPercentage) < 0 || Number(newCoupon.discountPercentage) > 100) {
      alert("Discount must be between 0% and 100%.");
      return;
    }
    if (await onAddCoupon(newCoupon)) {
      setNewCoupon({ code: '', discountPercentage: '' });
      alert("Coupon Created Successfully!");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) { await onBulkUpload(file); }
  };

  const pendingOrdersCount = (orders || []).filter(o => !o.status || o.status.toLowerCase() === 'pending').length;
  const pendingConsultationsCount = (consultations || []).filter(c => c.status === 'Scheduled').length;
  const pendingRequestsCount = (requests || []).filter(r => !r.status || r.status !== 'Fulfilled').length;
  const pendingSellRequestsCount = (sellRequests || []).length;
  const pendingQueriesCount = (queries || []).filter(q => !q.message?.includes('Program Type: ') && (!q.status || q.status !== 'Resolved')).length;
  const pendingInfluencersCount = (queries || []).filter(q => q.message?.includes('Program Type: INFLUENCER') && (!q.status || q.status !== 'Resolved')).length;
  const pendingBusinessPartnersCount = (queries || []).filter(q => q.message?.includes('Program Type: BUSINESS') && (!q.status || q.status !== 'Resolved')).length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-right">
          <input type="text" placeholder={`Search in ${activeTab}...`} className="dash-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button className="exit-btn" onClick={onClose}>Exit Dashboard</button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => { setActiveTab('inventory'); setSearchTerm(''); }}>📦 Stock</button>
        <button className={activeTab === 'offer-zone' ? 'active' : ''} onClick={() => { setActiveTab('offer-zone'); setSearchTerm(''); }}>🔥 Offers</button>
        <button className={activeTab === 'insights' ? 'active' : ''} onClick={() => { setActiveTab('insights'); setSearchTerm(''); }}>👁️ Insights</button>
        <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => { setActiveTab('requests'); setSearchTerm(''); }}>
          ✨ Requests {pendingRequestsCount > 0 && <span className="dash-tab-badge">{pendingRequestsCount}</span>}
        </button>
        <button className={activeTab === 'sell-requests' ? 'active' : ''} onClick={() => { setActiveTab('sell-requests'); setSearchTerm(''); }}>
          🤝 Sell Requests {pendingSellRequestsCount > 0 && <span className="dash-tab-badge">{pendingSellRequestsCount}</span>}
        </button>
        <button className={activeTab === 'queries' ? 'active' : ''} onClick={() => { setActiveTab('queries'); setSearchTerm(''); }}>
          📩 Queries {pendingQueriesCount > 0 && <span className="dash-tab-badge">{pendingQueriesCount}</span>}
        </button>
        <button className={activeTab === 'influencers' ? 'active' : ''} onClick={() => { setActiveTab('influencers'); setSearchTerm(''); }}>
          👥 Influencers {pendingInfluencersCount > 0 && <span className="dash-tab-badge">{pendingInfluencersCount}</span>}
        </button>
        <button className={activeTab === 'business-partners' ? 'active' : ''} onClick={() => { setActiveTab('business-partners'); setSearchTerm(''); }}>
          💼 Partners {pendingBusinessPartnersCount > 0 && <span className="dash-tab-badge">{pendingBusinessPartnersCount}</span>}
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); setSearchTerm(''); }}>
          💰 Orders {pendingOrdersCount > 0 && <span className="dash-tab-badge">{pendingOrdersCount}</span>}
        </button>
        <button className={activeTab === 'consultations' ? 'active' : ''} onClick={() => { setActiveTab('consultations'); setSearchTerm(''); }}>
          🔮 Consultations {pendingConsultationsCount > 0 && <span className="dash-tab-badge">{pendingConsultationsCount}</span>}
        </button>
        <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => { setActiveTab('categories'); setSearchTerm(''); }}>🏷️ Categories</button>
        <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => { setActiveTab('coupons'); setSearchTerm(''); }}>🎫 Coupons</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'inventory' && (
          <div className="tab-pane">
            <div className="admin-actions-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div className="add-number-form" style={{ flex: 2 }}>
                <h3>Add New VIP Number</h3>
                <form onSubmit={handleAddSubmit}>
                  <div className="form-grid">
                    <input type="text" placeholder="Number (e.g. 99999-00000)" value={newNumber.number} onChange={(e) => setNewNumber({...newNumber, number: e.target.value})} required />
                    <input type="number" placeholder="Original Price (₹)" value={newNumber.price} onChange={(e) => setNewNumber({...newNumber, price: e.target.value})} required />
                    <input type="number" placeholder="Offer Price (₹) - Optional" value={newNumber.offerPrice} onChange={(e) => setNewNumber({...newNumber, offerPrice: e.target.value})} />
                    <select value={newNumber.category} onChange={(e) => setNewNumber({...newNumber, category: e.target.value})} required style={{ textTransform: 'capitalize' }}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                    <select value={newNumber.operator} onChange={(e) => setNewNumber({...newNumber, operator: e.target.value})} required>
                      <option value="Airtel">Airtel</option>
                      <option value="Jio">Jio</option>
                      <option value="Vi">Vi</option>
                      <option value="BSNL">BSNL</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Short Description for Customers" 
                    value={newNumber.description} 
                    onChange={(e) => setNewNumber({...newNumber, description: e.target.value})}
                    style={{ marginTop: '10px' }}
                  ></textarea>
                  <button type="submit" className="save-btn">Add to Inventory</button>
                </form>
              </div>
              
              <div className="bulk-upload-box" style={{ flex: 1, backgroundColor: 'var(--card-bg)', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                <h3>Bulk Upload</h3>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px' }}>Upload CSV with columns: <strong>Number, Price, Category, Operator, OfferPrice, Description</strong></p>
                <input type="file" accept=".csv" onChange={handleFileChange} id="csv-upload" style={{ display: 'none' }} />
                <label htmlFor="csv-upload" className="save-btn" style={{ display: 'inline-block', backgroundColor: 'var(--primary-gold)', color: 'black', textAlign: 'center', cursor: 'pointer' }}>
                  Upload CSV File
                </label>
              </div>
            </div>

            <div className="inventory-list">
              <h3>Current Stock ({filteredInventory.length})</h3>
              <table className="dash-table">
                <thead><tr><th>Number</th><th>Total/Sum</th><th>Category</th><th>Operator</th><th>Price</th><th>Offer</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {filteredInventory.map(item => {
                    const rawDigits = (item.number || '').replace(/\D/g, '');
                    const total = rawDigits.split('').reduce((s, d) => s + parseInt(d), 0);
                    const sum = total === 0 ? 0 : (total - 1) % 9 + 1;
                    
                    const getOperatorColor = (oper = 'Airtel') => {
                      switch(oper.toLowerCase()) {
                        case 'jio': return { color: '#3b9cff', bg: 'rgba(0, 98, 172, 0.12)', border: 'rgba(0, 98, 172, 0.25)' };
                        case 'vi': return { color: '#ff3b3b', bg: 'rgba(224, 0, 0, 0.12)', border: 'rgba(224, 0, 0, 0.25)' };
                        case 'bsnl': return { color: '#ff914d', bg: 'rgba(243, 112, 33, 0.12)', border: 'rgba(243, 112, 33, 0.25)' };
                        default: return { color: '#ff4d4d', bg: 'rgba(234, 29, 36, 0.12)', border: 'rgba(234, 29, 36, 0.25)' };
                      }
                    };
                    const colorScheme = getOperatorColor(item.operator);

                    return (
                      <tr key={item._id}>
                        <td className="gold-text">{item.number}</td>
                        <td style={{ textAlign: 'center' }}><strong>{total}</strong> / <span className="gold-text">{sum}</span></td>
                        <td style={{ textTransform: 'capitalize' }}>{item.category}</td>
                        <td>
                          <span style={{ 
                            display: 'inline-block', 
                            fontSize: '0.7rem', 
                            padding: '3px 8px', 
                            borderRadius: '12px', 
                            color: colorScheme.color,
                            backgroundColor: colorScheme.bg,
                            border: `1px solid ${colorScheme.border}`,
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}>
                            {item.operator || 'Airtel'}
                          </span>
                        </td>
                        <td>₹{item.price.toLocaleString()}</td>
                        <td><input type="number" className="inline-offer-input" defaultValue={item.offerPrice || ''} onBlur={(e) => onUpdateOfferPrice(item._id, e.target.value)} /></td>
                        <td>
                          <button 
                            className={`status-badge ${item.isSold ? 'pending' : 'delivered'}`} 
                            style={{ 
                              cursor: 'pointer', 
                              border: 'none', 
                              padding: '5px 12px', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              width: '90px',
                              textAlign: 'center'
                            }}
                            onClick={() => onToggleSoldStatus(item._id, !item.isSold)}
                          >
                            {item.isSold ? 'Sold' : 'Available'}
                          </button>
                        </td>
                        <td><button className="del-btn" onClick={() => onDeleteNumber(item._id)}>Remove</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="tab-pane">
            <h3>Systematic Activity Log ({filteredActivity.length})</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Customer Name</th>
                  <th>Customer Phone</th>
                  <th>Action</th>
                  <th>Interaction Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivity.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontSize: '0.8rem', color: '#666', whiteSpace: 'nowrap' }}>{a.date}</td>
                    <td style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{a.user?.name || 'Guest'}</td>
                    <td>{a.user?.phone || 'Anonymous'}</td>
                    <td>
                      <span className={`status-badge ${a.action.toLowerCase().includes('success') || a.action.toLowerCase().includes('order') ? 'delivered' : 'pending'}`}>
                        {a.action}
                      </span>
                    </td>
                    <td className="activity-details-cell">{a.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'offer-zone' && (
          <div className="tab-pane">
            <h3>Active Offers ({offerZoneNumbers.length})</h3>
            <table className="dash-table">
              <thead><tr><th>Number</th><th>Original</th><th>Offer</th><th>Savings</th><th>Action</th></tr></thead>
              <tbody>
                {offerZoneNumbers.map(item => (
                  <tr key={item._id}>
                    <td className="gold-text">{item.number}</td>
                    <td style={{ textDecoration: 'line-through', color: '#666' }}>₹{item.price.toLocaleString()}</td>
                    <td style={{ color: '#25d366', fontWeight: 'bold' }}>₹{item.offerPrice.toLocaleString()}</td>
                    <td>₹{(item.price - item.offerPrice).toLocaleString()}</td>
                    <td><button className="del-btn" onClick={() => onUpdateOfferPrice(item._id, '')}>Remove Offer</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="tab-pane">
            <h3>Number Requests ({filteredRequests.length})</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Pattern</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(r => (
                  <tr key={r._id}>
                    <td>{r.date}</td>
                    <td style={{ textTransform: 'capitalize' }}><strong>{r.name}</strong><br/><small>+91 {r.phone}</small></td>
                    <td className="gold-text">{r.pattern}</td>
                    <td>₹{r.budget}</td>
                    <td>
                      <span className={`status-badge ${r.status === 'Fulfilled' ? 'delivered' : 'pending'}`}>
                        {r.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {r.status !== 'Fulfilled' && (
                          <button className="deliver-btn" style={{ height: '35px' }} onClick={() => onUpdateRequestStatus(r._id, 'Fulfilled')}>
                            Fulfilled
                          </button>
                        )}
                        <button className="del-btn" style={{ height: '35px' }} onClick={() => onDeleteRequest(r._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'sell-requests' && (
          <div className="tab-pane">
            <h3>Sell Requests ({filteredSellRequests.length})</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Seller</th>
                  <th>VIP Number</th>
                  <th>Expected Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSellRequests.map(sr => (
                  <tr key={sr._id}>
                    <td>{sr.date}</td>
                    <td style={{ textTransform: 'capitalize' }}>
                      <strong>{sr.name}</strong><br/>
                      <small>+91 {sr.phone}</small>
                    </td>
                    <td className="gold-text"><strong>{sr.numberToSell}</strong></td>
                    <td>₹{Number(sr.price).toLocaleString()}</td>
                    <td>
                      <button className="del-btn" onClick={() => onDeleteSellRequest(sr._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="tab-pane">
            <h3>Queries ({filteredQueries.length})</h3>
            <div className="queries-list">
              {filteredQueries.map(q => (
                <div key={q._id} className="query-card" style={{ position: 'relative' }}>
                  <div className="query-meta">
                    <strong>{q.name}</strong> ({q.email}) <span className="query-date">{q.date}</span>
                    <span 
                      className={`status-badge ${q.status === 'Resolved' ? 'delivered' : 'pending'}`}
                      style={{ marginLeft: '15px' }}
                    >
                      {q.status || 'Pending'}
                    </span>
                  </div>
                  <p className="query-msg">{q.message}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
                    {q.status !== 'Resolved' && (
                      <button className="deliver-btn" style={{ height: '32px', fontSize: '0.8rem', padding: '0 12px' }} onClick={() => onUpdateQueryStatus(q._id, 'Resolved')}>
                        Mark Resolved
                      </button>
                    )}
                    <button className="del-btn" style={{ height: '32px', fontSize: '0.8rem', padding: '0 12px' }} onClick={() => onDeleteQuery(q._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'influencers' && (
          <div className="tab-pane">
            <h3>Influencer Applications ({influencerQueries.length})</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Influencer Name</th>
                  <th>Contact Info</th>
                  <th>Channel / Profile</th>
                  <th>Message / Remark</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {influencerQueries.map(q => {
                  const partnerDetails = parsePartnerMessage(q.message);
                  return (
                    <tr key={q._id}>
                      <td>{q.date}</td>
                      <td><strong className="gold-text" style={{ textTransform: 'capitalize' }}>{q.name}</strong></td>
                      <td>
                        <strong>Email:</strong> {q.email}<br />
                        <strong>Phone:</strong> {partnerDetails.phone || 'N/A'}
                      </td>
                      <td>
                        <strong>{partnerDetails.businessName || 'N/A'}</strong><br />
                        {partnerDetails.platformLink && (
                          <a href={partnerDetails.platformLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontSize: '0.85rem' }}>
                            Visit Profile ↗
                          </a>
                        )}
                      </td>
                      <td><small style={{ color: '#aaa', display: 'block', maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{partnerDetails.message || 'N/A'}</small></td>
                      <td>
                        <span className={`status-badge ${q.status === 'Resolved' ? 'delivered' : 'pending'}`}>
                          {q.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button className="deliver-btn" style={{ height: '35px' }} onClick={() => handleCreateCouponFromPartner(partnerDetails.businessName || q.name, q._id)}>
                            🎫 Coupon
                          </button>
                          {q.status !== 'Resolved' && (
                            <button className="deliver-btn" style={{ height: '35px', backgroundColor: '#ffdf00', color: 'black' }} onClick={() => onUpdateQueryStatus(q._id, 'Resolved')}>
                              Resolve
                            </button>
                          )}
                          <button className="del-btn" style={{ height: '35px' }} onClick={() => onDeleteQuery(q._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'business-partners' && (
          <div className="tab-pane">
            <h3>Business Affiliation Applications ({businessQueries.length})</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Contact Name</th>
                  <th>Contact Info</th>
                  <th>Business Name / Website</th>
                  <th>Message / Remark</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {businessQueries.map(q => {
                  const partnerDetails = parsePartnerMessage(q.message);
                  return (
                    <tr key={q._id}>
                      <td>{q.date}</td>
                      <td><strong className="gold-text" style={{ textTransform: 'capitalize' }}>{q.name}</strong></td>
                      <td>
                        <strong>Email:</strong> {q.email}<br />
                        <strong>Phone:</strong> {partnerDetails.phone || 'N/A'}
                      </td>
                      <td>
                        <strong>{partnerDetails.businessName || 'N/A'}</strong><br />
                        {partnerDetails.platformLink && (
                          <a href={partnerDetails.platformLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontSize: '0.85rem' }}>
                            Visit Website ↗
                          </a>
                        )}
                      </td>
                      <td><small style={{ color: '#aaa', display: 'block', maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{partnerDetails.message || 'N/A'}</small></td>
                      <td>
                        <span className={`status-badge ${q.status === 'Resolved' ? 'delivered' : 'pending'}`}>
                          {q.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button className="deliver-btn" style={{ height: '35px' }} onClick={() => handleCreateCouponFromPartner(partnerDetails.businessName || q.name, q._id)}>
                            🎫 Coupon
                          </button>
                          {q.status !== 'Resolved' && (
                            <button className="deliver-btn" style={{ height: '35px', backgroundColor: '#ffdf00', color: 'black' }} onClick={() => onUpdateQueryStatus(q._id, 'Resolved')}>
                              Resolve
                            </button>
                          )}
                          <button className="del-btn" style={{ height: '35px' }} onClick={() => onDeleteQuery(q._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="tab-pane">
            <h3>Orders ({filteredOrders.length})</h3>
            <table className="dash-table">
              <thead><tr><th>Date</th><th>Customer</th><th>Numbers</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o._id}>
                    <td>{o.date}</td>
                    <td style={{ textTransform: 'capitalize' }}>
                      <strong>{o.customer?.name || 'Guest'}</strong><br/>
                      <small>+91 {o.customer?.phone || 'Anonymous'}</small>
                      {o.customer?.email && <><br/><small style={{ textTransform: 'none' }}>{o.customer.email}</small></>}
                      {o.customer?.address && <><br/><small style={{ color: '#aaa', display: 'block', marginTop: '4px', whiteSpace: 'normal', maxWidth: '300px' }}>📍 {o.customer.address}</small></>}
                    </td>
                    <td>
                      {(o.items || []).map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '12px', borderBottom: idx < o.items.length - 1 ? '1px dashed #222' : 'none', paddingBottom: '6px' }}>
                          <span className="gold-text" style={{ fontWeight: 'bold', display: 'block' }}>{item.number}</span>
                          <span style={{ fontSize: '0.75rem', color: '#888' }}>Cat: {item.category}</span>
                          <div style={{ marginTop: '5px' }}>
                            <label style={{ fontSize: '0.7rem', color: '#666', display: 'block' }}>UPC Code:</label>
                            <input 
                              type="text" 
                              placeholder="e.g. PORT12345" 
                              value={tempUpcs[`${o._id}_${item.number}`] !== undefined ? tempUpcs[`${o._id}_${item.number}`] : (item.upcCode || '')}
                              onChange={(e) => setTempUpcs(prev => ({ ...prev, [`${o._id}_${item.number}`]: e.target.value.toUpperCase() }))}
                              disabled={o.status === 'Delivered'}
                              style={{ 
                                backgroundColor: '#151515', 
                                color: '#fff', 
                                border: '1px solid #333', 
                                padding: '3px 8px', 
                                borderRadius: '4px', 
                                fontSize: '0.75rem', 
                                width: '130px',
                                marginTop: '2px'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="gold-text">₹{(o.total || 0).toLocaleString()}</td>
                    <td><span className={`status-badge ${o.status?.toLowerCase() || 'pending'}`}>{o.status || 'Pending'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        {o.status !== 'Delivered' && (
                          <button 
                            className="deliver-btn" 
                            onClick={async () => {
                              const updatedItems = (o.items || []).map(item => {
                                const upcVal = tempUpcs[`${o._id}_${item.number}`] !== undefined 
                                  ? tempUpcs[`${o._id}_${item.number}`] 
                                  : (item.upcCode || '');
                                return { ...item, upcCode: upcVal };
                              });

                              const hasEmptyUpc = updatedItems.some(i => !i.upcCode.trim());
                              if (hasEmptyUpc) {
                                if (!window.confirm("Some numbers do not have a UPC code entered. Mark as Delivered anyway?")) {
                                  return;
                                }
                              }

                              if (await onDeliverOrder(o._id, updatedItems)) {
                                alert("Order marked as Delivered and UPC codes updated successfully!");
                              } else {
                                alert("Failed to update order.");
                              }
                            }}
                          >
                            Save & Deliver
                          </button>
                        )}
                        <button className="del-btn" onClick={() => onDeleteOrder(o._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="tab-pane">
            <h3>🔮 Astro-Numerology Consultations ({filteredConsultations.length})</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date & Slot</th>
                  <th>Client Contact</th>
                  <th>Birth Details</th>
                  <th>Price Paid</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.map(c => {
                  const whatsappText = encodeURIComponent(`Hi ${c.customerName}, I am your astrologer for your scheduled Astro-Numerology consultation booked for ${c.bookingDate} at ${c.bookingSlot}. Please confirm if you are ready for the call.`);
                  const isEditing = editingId === c._id;
                  
                  return (
                    <tr key={c._id}>
                      <td>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <input 
                              type="date" 
                              value={editDate} 
                              onChange={(e) => setEditDate(e.target.value)}
                              style={{ backgroundColor: '#151515', color: 'white', border: '1px solid #333', padding: '5px', borderRadius: '4px', fontSize: '0.8rem' }}
                            />
                            <select 
                              value={editSlot} 
                              onChange={(e) => setEditSlot(e.target.value)}
                              style={{ backgroundColor: '#151515', color: 'white', border: '1px solid #333', padding: '5px', borderRadius: '4px', fontSize: '0.8rem' }}
                            >
                              {timeSlots.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <>
                            <strong>{c.bookingDate}</strong><br />
                            <span className="gold-text"><small>{c.bookingSlot}</small></span>
                          </>
                        )}
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>
                        <strong>{c.customerName}</strong><br />
                        <small>+91 {c.phone}</small><br />
                        <small>{c.email}</small>
                      </td>
                      <td>
                        <strong>DOB:</strong> {c.dateOfBirth}<br />
                        <strong>Time:</strong> {c.timeOfBirth}<br />
                        <strong>Place:</strong> <span style={{ textTransform: 'capitalize' }}>{c.placeOfBirth}</span>
                      </td>
                      <td className="gold-text">₹{(c.pricePaid || 499).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${c.status === 'Completed' ? 'delivered' : 'pending'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {isEditing ? (
                            <>
                              <button 
                                className="deliver-btn" 
                                style={{ height: '35px', backgroundColor: '#25d366', color: 'black' }}
                                onClick={async () => {
                                  if (await onUpdateConsultation(c._id, { bookingDate: editDate, bookingSlot: editSlot })) {
                                    setEditingId(null);
                                  }
                                }}
                              >
                                Save
                              </button>
                              <button 
                                className="del-btn" 
                                style={{ height: '35px' }}
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <a 
                                href={`https://wa.me/91${c.phone}?text=${whatsappText}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="deliver-btn" 
                                style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center', lineHeight: '24px', height: '35px', padding: '5px 15px' }}
                              >
                                💬 WhatsApp
                              </a>
                              <button 
                                className="deliver-btn" 
                                style={{ height: '35px', backgroundColor: '#ffdf00', color: 'black' }}
                                onClick={() => {
                                  setEditingId(c._id);
                                  setEditDate(c.bookingDate);
                                  setEditSlot(c.bookingSlot);
                                }}
                              >
                                ✏️ Edit
                              </button>
                              {c.status !== 'Completed' && (
                                <button 
                                  className="deliver-btn" 
                                  style={{ height: '35px' }} 
                                  onClick={() => onUpdateConsultation(c._id, { status: 'Completed' })}
                                >
                                  Done
                                </button>
                              )}
                              <button className="del-btn" style={{ height: '35px' }} onClick={() => onDeleteConsultation(c._id)}>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="tab-pane">
            <div className="add-number-form">
              <h3>Manage Categories</h3>
              <form onSubmit={handleCatSubmit} style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Category Name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} required />
                <button type="submit" className="save-btn">Add Category</button>
              </form>
            </div>
            <div className="inventory-list">
              <table className="dash-table">
                <thead><tr><th>Category Name</th><th>Action</th></tr></thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat._id}>
                      <td className="gold-text" style={{ textTransform: 'capitalize' }}>{cat.name}</td>
                      <td><button className="del-btn" onClick={() => onDeleteCategory(cat._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="tab-pane">
            <div className="add-number-form">
              <h3>Create New Coupon</h3>
              <form onSubmit={handleCouponSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'bold' }}>COUPON CODE</label>
                  <input type="text" placeholder="e.g. INFLUENCER10" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase().trim()})} required style={{ textTransform: 'uppercase' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'bold' }}>DISCOUNT PERCENTAGE (%)</label>
                  <input type="number" placeholder="e.g. 10" min="0" max="100" value={newCoupon.discountPercentage} onChange={(e) => setNewCoupon({...newCoupon, discountPercentage: e.target.value})} required />
                </div>
                <button type="submit" className="save-btn" style={{ height: '45px' }}>Create Coupon</button>
              </form>
            </div>

            <div className="inventory-list">
              <h3>Active Coupons ({filteredCoupons.length})</h3>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Coupon Code</th>
                    <th>Discount Percentage</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map(c => (
                    <tr key={c._id}>
                      <td className="gold-text"><strong>{c.code}</strong></td>
                      <td>{c.discountPercentage}% OFF</td>
                      <td>
                        <span className={`status-badge ${c.isActive ? 'delivered' : 'pending'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button className="del-btn" onClick={() => onDeleteCoupon(c._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
