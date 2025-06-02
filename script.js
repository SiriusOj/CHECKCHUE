const statusOptions = ["มา", "มาสาย", "อยากลา", "ลาป่วย", "ลากิจ"];
let users = Array.from({length: 30}, (_, i) => ({
  no: i+1,
  name: `นักเรียน ${i+1}`
}));

function renderTable() {
  const tbody = document.getElementById('userTable');
  tbody.innerHTML = '';
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.no}</td>
      <td>${user.name}</td>
      <td>
        <select class="status-select" id="status-${user.no}">
          ${statusOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });
  updateCounts();
}

function saveProfile() {
  const no = parseInt(document.getElementById('userNo').value, 10);
  const name = document.getElementById('userName').value;
  if (no >= 1 && no <= 30 && name.trim()) {
    users[no-1].name = name;
    renderTable();
    alert('บันทึกโปรไฟล์เรียบร้อย');
  }
}

function saveAttendance() {
  const date = document.getElementById('attendanceDate').value;
  if (!date) { alert('กรุณาเลือกวันที่'); return; }
  const attendance = users.map(user => ({
    no: user.no,
    name: user.name,
    status: document.getElementById(`status-${user.no}`).value,
    date: date
  }));
  // นำ attendance ไปอัปโหลด Google Sheet ด้วย Google Apps Script หรือ export CSV
  console.log(attendance);
  alert('บันทึกการเช็คชื่อเรียบร้อย');
}

function updateCounts() {
  let countPresent = 0;
  let countLeave = 0;
  users.forEach(user => {
    const status = document.getElementById(`status-${user.no}`)?.value;
    if (status === "มา" || status === "มาสาย") countPresent++;
    if (["อยากลา", "ลาป่วย", "ลากิจ"].includes(status)) countLeave++;
  });
  document.getElementById('count-present').textContent = `มา: ${countPresent}`;
  document.getElementById('count-leave').textContent = `ลา: ${countLeave}`;
}

// อัปเดตยอดทุกครั้งที่มีการเปลี่ยนแปลงสถานะ
document.addEventListener('change', function(e) {
  if (e.target.classList.contains('status-select')) updateCounts();
});

renderTable();

function exportToCSV() {
  const date = document.getElementById('attendanceDate').value  '';
  // สร้าง header
  const header = ['no', 'name', 'status', 'date'];
  // ดึงข้อมูล attendance
  const attendance = users.map(user => ({
    no: user.no,
    name: user.name,
    status: document.getElementById(status-${user.no}).value,
    date: date
  }));
  // แปลงเป็น CSV string
  const rows = [
    header.join(','), // header
    ...attendance.map(row => [
      row.no,
      "${row.name.replace(/"/g, '""')}", // escape "
      "${row.status.replace(/"/g, '""')}",
      row.date
    ].join(','))
  ];
  const csvContent = rows.join('\r\n');

  // สร้าง Blob แล้วดาวน์โหลด
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `attendance_${date  'no_date'}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
