import os
import sys
import subprocess
from openai import OpenAI
from dotenv import load_dotenv
import tempfile

load_dotenv()
OpenAI.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI()


def read_code(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write_tmp(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def ai_migrate(code):
    prompt = (
        "You are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. Only terminate your turn when you are sure that the problem is solved."
        "If you are not sure about file content or codebase structure pertaining to the user's request, use your tools to read files and gather the relevant information: do NOT guess or make up an answer."
        "Below is Python 3 code that was translated from Python 2 using 2to3. "
        "Please improve the code to make it more idiomatic and robust in Python 3, but only output the code with nothing else. Remember to remove ``` at the beginning and the end"
        "If any comments are added to explain key changes, include them inline.\n\n"
        f"{code}"
    )
    resp = client.responses.create(
        model="gpt-4.1",
        input=prompt,
    )
    return resp.output_text


def write_tmp(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


from lib2to3.refactor import RefactoringTool, get_fixers_from_package

def run_2to3(src_path, dst_path):
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    # 读取源代码
    with open(src_path, "r", encoding="utf-8") as src_file:
        code = src_file.read()
    # 初始化 lib2to3 的转换器
    fixer_pkg = "lib2to3.fixes"
    tool = RefactoringTool(get_fixers_from_package(fixer_pkg))
    # 转换
    tree = tool.refactor_string(code, src_path)
    # 写入结果
    with open(dst_path, "w", encoding="utf-8") as dst_file:
        dst_file.write(str(tree))


def migrate_file(src_path, dst_path):
    # Step 1: 2to3 conversion (src_path → dst_path)
    run_2to3(src_path, dst_path)
    # Step 2: AI improvement
    code3 = read_code(dst_path)
    code3_improved = ai_migrate(code3)
    write_tmp(dst_path, code3_improved)


def migrate_dir(src_dir, dst_dir):
    os.makedirs(dst_dir, exist_ok=True)
    for fname in os.listdir(src_dir):
        if not fname.endswith(".py"):
            continue
        migrate_file(
            os.path.join(src_dir, fname),
            os.path.join(dst_dir, fname),
        )


def migrate_code_str(code_str):
    with tempfile.TemporaryDirectory() as tmpdir:
        src_path = os.path.join(tmpdir, "src.py")
        dst_path = os.path.join(tmpdir, "dst.py")
        with open(src_path, "w", encoding="utf-8") as f:
            f.write(code_str)
        run_2to3(src_path, dst_path)
        code3 = read_code(dst_path)
        code3_improved = ai_migrate(code3)
        return code3_improved

def main():
    if len(sys.argv) != 3:
        print("Usage: python translate.py <python2_src> <python3_dst>")
        sys.exit(1)
    src, dst = sys.argv[1], sys.argv[2]

    if os.path.isfile(src):
        if not dst.endswith(".py"):
            print("If the source is a file, destination must be a file ending with .py")
            sys.exit(1)
        migrate_file(src, dst)
    elif os.path.isdir(src):
        if os.path.isfile(dst):
            print("If the source is a folder, destination must be a folder.")
            sys.exit(1)
        migrate_dir(src, dst)
    else:
        print(f"Source path {src} does not exist.")
        sys.exit(1)


if __name__ == "__main__":
    main()
