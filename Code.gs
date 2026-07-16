/**
 * IAN GLOBAL — 契約書PDF受信 → メール送信 (無料・サーバー不要)
 * -------------------------------------------------------------
 * 使い方:
 *  1) https://script.google.com で「新しいプロジェクト」を作成
 *  2) このコードを全て貼り付け
 *  3) 下の RECIPIENT を送信先に設定（デフォルト: hjhan@ianglobal.im）
 *  4) 右上「デプロイ」→「新しいデプロイ」→ 種類=ウェブアプリ
 *       - 次のユーザーとして実行: 自分
 *       - アクセスできるユーザー: 全員
 *     → 「デプロイ」→ 表示された「ウェブアプリ URL」をコピー
 *  5) その URL を sign.html の APPS_SCRIPT_URL に貼り付け
 * -------------------------------------------------------------
 */

// ▼ 送信先メールアドレス（複数可、カンマ区切り）
var RECIPIENT = "hjhan@ianglobal.im";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var name  = data.name  || "(no name)";
    var ig    = data.instagram || data.sns || "";
    var email = data.email || "";
    var phone = data.phone || "";
    var date  = data.date  || "";
    var ts    = data.ts    || "";
    var program = data.program || "Judaan Japan Ambassador Challenge";
    var filename = data.filename || ("Judaan_Consent_" + Date.now() + ".pdf");

    // base64 → PDF Blob
    var bytes = Utilities.base64Decode(data.pdfBase64);
    var pdfBlob = Utilities.newBlob(bytes, "application/pdf", filename);

    var subject = "【참가 동의 완료】" + program + " - " + name;
    var body =
      program + " 참가 신청 및 동의가 완료되었습니다.\n" +
      "A new participant has signed the consent form.\n\n" +
      "■ 이름/활동명 (Name) : " + name + "\n" +
      "■ Instagram         : " + ig + "\n" +
      "■ 이메일 (Email)     : " + (email || "-") + "\n" +
      "■ 연락처 (Contact)   : " + (phone || "-") + "\n" +
      "■ 신청일 (Date)      : " + date + "\n" +
      "■ 제출시각 (Time)    : " + ts + "\n\n" +
      "서명 및 8개 항목 동의가 포함된 PDF를 첨부합니다.\n" +
      "The signed consent PDF (with all 8 agreements) is attached.\n" +
      "— IAN GLOBAL / Judaan 자동 전송 —";

    MailApp.sendEmail({
      to: RECIPIENT,
      subject: subject,
      body: body,
      attachments: [pdfBlob],
      name: "IAN GLOBAL 契約システム"
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 動作確認用（ブラウザでURLを開くと表示される）
function doGet() {
  return ContentService.createTextOutput("IAN GLOBAL contract endpoint is running.");
}
