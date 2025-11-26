import React from "react";

const HomePage = () => {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>

      {/* ----------------- SECTION 1 : TOP BLUE SECTION ----------------- */}
      <div
        style={{
          backgroundColor: "#aee2ff",
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          paddingBottom: "80px",
        }}
      >
        {/* Left Hearts */}
        <img
          src="https://i.imgur.com/2LHRxCE.png"
          alt="hearts"
          style={{
            position: "absolute",
            left: "20px",
            top: "30px",
            width: "120px",
          }}
        />

        {/* Right Hearts */}
        <img
          src="https://i.imgur.com/2LHRxCE.png"
          alt="hearts"
          style={{
            position: "absolute",
            right: "20px",
            top: "30px",
            width: "120px",
          }}
        />

        {/* Left Hands */}
        <img
          src="https://i.imgur.com/Qe8qX1e.png"
          alt="hands"
          style={{
            position: "absolute",
            left: "0",
            bottom: "0",
            width: "230px",
          }}
        />

        {/* Right Hands */}
        <img
          src="https://i.imgur.com/Qe8qX1e.png"
          alt="hands"
          style={{
            position: "absolute",
            right: "0",
            bottom: "0",
            width: "230px",
            transform: "scaleX(-1)",
          }}
        />

        {/* Title */}
        <h1
          style={{
            textAlign: "center",
            paddingTop: "120px",
            fontSize: "44px",
            fontWeight: "600",
            color: "#222",
          }}
        >
          “Reunite with What Matters Most”
        </h1>

        {/* Description */}
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            marginTop: "15px",
            lineHeight: "26px",
          }}
        >
          Lost something dear? Or found someone’s cherished belonging?
          <br />
          Join the community and make a difference today.
        </p>

        {/* Scroll Text */}
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "15px",
            }}
          >
            <div
              style={{
                height: "12px",
                width: "12px",
                backgroundColor: "#5ab4ff",
                borderRadius: "2px",
              }}
            ></div>
            Scroll to see people sharing their happy moments of reuniting
          </span>
        </div>
      </div>

      {/* ----------------- SECTION 2 : RECENTLY POSTED ITEMS ----------------- */}
      <div
        style={{
          backgroundColor: "#f9cdda",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            color: "#7a2558",
            marginBottom: "35px",
            fontWeight: "bold",
          }}
        >
          Recently Posted Items
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "25px",
            maxWidth: "1200px",
            margin: "auto",
          }}
        >
          {[
            { title: "Books", loc: "Bhimavaram", img: "https://i.imgur.com/8h0JMu7.jpeg" },
            { title: "Watch", loc: "Bangalore", img: "https://i.imgur.com/Nj8xqQS.jpeg" },
            { title: "Cat", loc: "Kukatpally", img: "https://i.imgur.com/v0LQGbf.jpeg" },
            { title: "Umbrella", loc: "Nandigama", img: "https://i.imgur.com/rpXbDdI.jpeg" },
            { title: "Doll", loc: "Hyderabad", img: "https://i.imgur.com/6fVxGoU.jpeg" },
            { title: "Keys", loc: "Vijayawada", img: "https://i.imgur.com/sTVYFzE.jpeg" },
            { title: "Handbag", loc: "Hyderabad", img: "https://i.imgur.com/4bKFG8M.jpeg" },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                borderRadius: "12px",
                paddingBottom: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />
              <h3 style={{ color: "#7a2558", marginTop: "10px" }}>{item.title}</h3>
              <p style={{ margin: 0 }}>lost</p>
              <p style={{ fontSize: "14px" }}>
                <b>Location:</b> {item.loc}
              </p>
              <p style={{ fontSize: "13px", color: "#777" }}>view</p>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- SECTION 3 : SUCCESS STORIES ----------------- */}
      <div
        style={{
          backgroundColor: "#f9cdda",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "26px",
            color: "#7a2558",
            marginBottom: "30px",
          }}
        >
          Did you find your belonging on this platform? Share it{" "}
          <a href="#" style={{ color: "#5a0b43", fontWeight: "bold" }}>
            here
          </a>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "25px",
            maxWidth: "1200px",
            margin: "auto",
          }}
        >
          {[
            { img: "https://i.imgur.com/2K0GbWa.jpeg", text: "I lost my wallet at the park, and a kind stranger returned it. - Ram" },
            { img: "https://i.imgur.com/qm5vUXT.jpeg", text: "My missing dog was found thanks to this community! - John" },
            { img: "https://i.imgur.com/w2T2ctR.jpeg", text: "I thought my phone was gone forever. Thank you! - Alex" },
            { img: "https://i.imgur.com/MuQgYUD.jpeg", text: "This app reunited me with my bike. - Sanjay" },
            { img: "https://i.imgur.com/2QA9pTO.jpeg", text: "My son's toy was returned by a kind user." },
            { img: "https://i.imgur.com/LuXUx6g.jpeg", text: "Found my house keys within hours!" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={s.img}
                alt="story"
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <p style={{ marginTop: "10px", fontStyle: "italic" }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- SECTION 4 : POST LOST/FOUND FORM ----------------- */}
      <div
        style={{
          background: "linear-gradient(#ffe0f0, #f7a8c9)",
          padding: "50px 20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "35px",
            borderRadius: "15px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#7a2558" }}>
            Post a Lost or Found Item
          </h2>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            Help someone reunite with what they lost ❤
          </p>

          <label>Type of Item</label>
          <select style={inputBoxStyle}>
            <option value="">Select</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <label>Item Name</label>
          <input type="text" style={inputBoxStyle} />

          <label>Description</label>
          <textarea rows="4" style={inputBoxStyle}></textarea>

          <label>Location</label>
          <input type="text" style={inputBoxStyle} />

          <label>Upload Image</label>
          <input type="file" style={{ marginBottom: "20px" }} />

          <button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              background: "linear-gradient(#ff4e8e, #d6277b)",
              cursor: "pointer",
            }}
          >
            Post Item
          </button>
        </div>
      </div>
    </div>
  );
};

/* Input Style */
const inputBoxStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "5px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

export default HomePage;