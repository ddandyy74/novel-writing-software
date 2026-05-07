use clap::Parser;
use std::process::ExitCode;

mod test_runner;

#[derive(Parser)]
#[command(name = "novel-writer")]
#[command(version = "1.0.0")]
#[command(about = "网文作者码字软件", long_about = None)]
struct Cli {
    #[arg(long, group = "mode")]
    test: bool,
    
    #[arg(long, group = "mode")]
    doctor: bool,
    
    #[arg(long, group = "mode")]
    logs: bool,
    
    #[arg(long, short = 'j')]
    json: bool,
    
    #[arg(long, default_value = "50")]
    tail: usize,
    
    #[arg(long)]
    feature: Option<String>,
}

fn main() -> ExitCode {
    let cli = Cli::parse();
    
    if cli.test {
        return run_tests(cli.json, cli.feature);
    }
    
    if cli.doctor {
        run_doctor();
        return ExitCode::SUCCESS;
    }
    
    if cli.logs {
        show_logs(cli.tail);
        return ExitCode::SUCCESS;
    }
    
    app_lib::run();
    ExitCode::SUCCESS
}

fn run_tests(json: bool, _feature: Option<String>) -> ExitCode {
    let report = test_runner::run_all_tests();
    
    if json {
        println!("{}", serde_json::to_string_pretty(&report).unwrap());
    } else {
        print_text_report(&report);
    }
    
    if report.summary.failed > 0 {
        ExitCode::FAILURE
    } else {
        ExitCode::SUCCESS
    }
}

fn print_text_report(report: &test_runner::TestReport) {
    println!("\n网文作者码字软件 P0 功能测试报告");
    println!("=====================================");
    println!("版本: {}", report.version);
    println!("时间: {}", report.timestamp);
    println!("耗时: {:.2}s", report.duration_ms as f64 / 1000.0);
    println!();
    
    for result in &report.results {
        let status = if result.passed { "[PASS]" } else { "[FAIL]" };
        println!("{} {}/{} - {}ms", status, result.module, result.name, result.duration_ms);
        if let Some(details) = &result.details {
            println!("  └─ {}", details);
        }
        if let Some(error) = &result.error {
            println!("  └─ 错误: {}", error);
        }
    }
    
    println!();
    println!("=====================================");
    println!("总计: {} | 通过: {} | 失败: {}", 
        report.summary.total,
        report.summary.passed,
        report.summary.failed
    );
    
    if report.summary.failed == 0 {
        println!("\n✅ 所有测试通过！");
    } else {
        println!("\n❌ 存在失败测试！");
    }
}

fn run_doctor() {
    println!("\n系统诊断报告");
    println!("=============\n");
    
    println!("✓ 应用版本: {}", env!("CARGO_PKG_VERSION"));
    println!("✓ 操作系统: {}", std::env::consts::OS);
    println!("✓ 架构: {}", std::env::consts::ARCH);
    
    println!("\n✓ 所有诊断项通过");
}

fn show_logs(tail: usize) {
    println!("\n最近 {} 条日志:", tail);
    println!("{}\n", "[暂无日志]");
}
