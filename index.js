import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyBFbbBEtM0I5yc14IroMNudFqu1d6yo_A4",
  authDomain: "soma-fc6bd.firebaseapp.com",
  projectId: "soma-fc6bd",
  storageBucket: "soma-fc6bd.appspot.com",
  messagingSenderId: "661320393614",
  appId: "1:661320393614:web:a498ba68c36edd17d37adf"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ 登入功能
window.login = async function (e) {
  e.preventDefault();
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("pwInput").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ 登入成功");
  } catch (err) {
    console.error("❌ 登入失敗：" + err.message);
    alert("登入失敗：" + err.message);
  }
};

// ✅ 登入狀態監聽
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("uidSpan").textContent = user.uid;
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("dailyForm").style.display = "block";
  } else {
    document.getElementById("uidSpan").textContent = "尚未登入";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("dailyForm").style.display = "none";
  }
});

// ✅ 提交日誌表單
window.submitDaily = async function (e) {
  e.preventDefault();

  const breakfast = document.getElementById("breakfastInput").value.trim();
  const mood = document.getElementById("moodInput").value.trim();

  // 讀取行程表
  const schedule = {};
  for (let hour = 6; hour <= 22; hour++) {
    const input = document.querySelector(`input[name="schedule-${hour}"]`);
    schedule[`${hour}:00`] = input?.value || "";
  }

  // 讀取勾選目標
  const goals = Array.from(document.querySelectorAll("input[name='goals']:checked"))
                     .map(cb => cb.value);

  const uid = auth.currentUser?.uid;
  if (!uid) return alert("尚未登入");

  const today = new Date().toISOString().split('T')[0];
  const ref = doc(db, `users/${uid}/dailyLogs/${today}`);

  try {
    await setDoc(ref, {
      breakfast,
      mood,
      schedule,
      goals,
      timestamp: new Date()
    });
    alert("✅ 今日紀錄已提交！");
    e.target.reset();
  } catch (error) {
    console.error("❌ 發生錯誤：", error);
    alert("送出失敗：" + error.message);
  }
};


