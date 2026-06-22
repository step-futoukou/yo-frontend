// バックエンドの進行状態から「今いるべき画面」を決める resolver。
// App / Home / Meeting / Mission の初期画面復元に共通で使う。
//
// 戻り値: { route, screen }
//   route  … App の currentScreen ('/home' | '/meeting' | '/mission')
//   screen … Meeting/Mission の内部サブ画面（route が /home の時は null）
//
// 引数:
//   userId … 自分の userId
//   status … GET /api/meetings/:match_id/status のレスポンス
//             { match: {id,user_a_id,user_b_id,status}, meeting: {...}|null }

export function resolveScreen(userId, status) {
  // マッチ自体が無い → ホーム
  if (!status || !status.match) return { route: "/home", screen: null };

  const { match, meeting } = status;
  const mySide = match.user_b_id === userId ? "b" : "a";

  // 待ち合わせ未開始 / 希望が1件も無い → 希望入力の入口（Meeting "match"）
  if (!meeting || (!meeting.wishes_a && !meeting.wishes_b)) {
    return { route: "/meeting", screen: "match" };
  }

  const myWish = mySide === "a" ? meeting.wishes_a : meeting.wishes_b;
  const bothWish = meeting.wishes_a && meeting.wishes_b;

  // 自分がまだ希望を送っていない → 入口へ
  if (!myWish) return { route: "/meeting", screen: "match" };

  // 自分は送ったが相手待ち → waiting
  if (myWish && !bothWish) return { route: "/meeting", screen: "waiting" };

  // 両者送信済み
  if (meeting.status === "no_match") return { route: "/meeting", screen: "no_match" };

  if (meeting.status === "proposed") {
    const myConfirmed = mySide === "a" ? meeting.confirmed_a : meeting.confirmed_b;
    const bothConfirmed = meeting.confirmed_a === 1 && meeting.confirmed_b === 1;

    if (!myConfirmed) return { route: "/meeting", screen: "propose" };
    if (myConfirmed && !bothConfirmed) return { route: "/meeting", screen: "confirming" };

    // 両者合意済み → 当日フローへ（到着フラグで分岐）
    const myArrived = mySide === "a" ? meeting.arrived_a : meeting.arrived_b;
    const bothArrived = meeting.arrived_a === 1 && meeting.arrived_b === 1;

    if (bothArrived) return { route: "/mission", screen: "meetup_check" };
    if (myArrived) return { route: "/mission", screen: "arrived" };
    // まだ誰も到着していない → 準備完了（Meeting done）。ここから「ミッションへ」で当日画面に進む
    return { route: "/meeting", screen: "done" };
  }

  // proposed でも no_match でもない（理論上 waiting だが両者送信済み）→ 念のため waiting
  return { route: "/meeting", screen: "waiting" };
}
