/**
 * Demo: await tuần tự vs Promise.all song song
 */

function delay(ms, name) {
    console.log(`  [${name}] Bắt đầu...`);
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`  [${name}] Xong sau ${ms}ms`);
            resolve(`${name}: ${ms}ms`);
        }, ms);
    });
}

async function sequential() {
    console.log('\n=== TUẦN TỰ (await từng cái) ===');
    const start = Date.now();

    // delay(100) chạy XONG rồi mới đến delay(50)
    const r1 = await delay(100, 'Task1');
    const r2 = await delay(50, 'Task2');
    const r3 = await delay(80, 'Task3');

    const elapsed = Date.now() - start;
    console.log(`\n  Kết quả: ${r1}, ${r2}, ${r3}`);
    console.log(`  Tổng thời gian: ${elapsed}ms (100 + 50 + 80 = 230ms)`);
}

async function parallel() {
    console.log('\n=== SONG SONG (Promise.all) ===');
    const start = Date.now();

    // Cả 3 delay BẮT ĐẦU CÙNG LÚC
    const [r1, r2, r3] = await Promise.all([
        delay(100, 'Task1'),
        delay(50, 'Task2'),
        delay(80, 'Task3')
    ]);

    const elapsed = Date.now() - start;
    console.log(`\n  Kết quả: ${r1}, ${r2}, ${r3}`);
    console.log(`  Tổng thời gian: ${elapsed}ms (~100ms, chậm nhất)`);
}

// Chạy demo
(async () => {
    await sequential();
    await parallel();

    console.log('\n=== KẾT LUẬN ===');
    console.log(`
  await từng cái:
    - Chạy TUẦN TỰ, cái sau CHỜ cái trước
    - Dùng khi: Task B cần kết quả của Task A

  Promise.all:
    - Chạy SONG SONG, tất cả bắt đầu cùng lúc
    - Dùng khi: Các tasks ĐỘC LẬP, không phụ thuộc nhau
    - Nhanh hơn nhiều!
    `);
})();
