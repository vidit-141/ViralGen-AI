import asyncio
import aiohttp
import time

API_BASE = "http://localhost:8000"

TEST_REQUESTS = [
    {"brief": "noise cancelling headphones for remote workers", "persona": "witty", "platform": "instagram"},
    {"brief": "organic protein powder for gym enthusiasts", "persona": "urgent", "platform": "twitter"},
    {"brief": "premium leather wallet for professionals", "persona": "professional", "platform": "linkedin"},
    {"brief": "eco friendly water bottle for hikers", "persona": "playful", "platform": "instagram"},
    {"brief": "smart home security camera for families", "persona": "professional", "platform": "linkedin"},
]

async def submit_job(session: aiohttp.ClientSession, payload: dict, index: int) -> dict:
    start = time.time()
    try:
        async with session.post(
            f"{API_BASE}/generate/asset/async",
            json=payload,
            timeout=aiohttp.ClientTimeout(total=10)
        ) as res:
            data = await res.json()
            elapsed = time.time() - start
            print(f"[{index}] Job submitted in {elapsed:.2f}s — job_id: {data.get('job_id', 'ERROR')}")
            return {"index": index, "job_id": data.get("job_id"), "submit_time": elapsed}
    except Exception as e:
        elapsed = time.time() - start
        print(f"[{index}] FAILED in {elapsed:.2f}s — {e}")
        return {"index": index, "job_id": None, "error": str(e)}

async def poll_job(session: aiohttp.ClientSession, job_id: str, index: int) -> dict:
    start = time.time()
    while True:
        try:
            async with session.get(
                f"{API_BASE}/task/{job_id}/status",
                timeout=aiohttp.ClientTimeout(total=5)
            ) as res:
                data = await res.json()
                status = data.get("status")

                if status == "SUCCESS":
                    elapsed = time.time() - start
                    print(f"[{index}] SUCCESS in {elapsed:.0f}s")
                    return {"index": index, "status": "SUCCESS", "time": elapsed}

                elif status == "FAILURE":
                    elapsed = time.time() - start
                    print(f"[{index}] FAILURE in {elapsed:.0f}s — {data.get('error')}")
                    return {"index": index, "status": "FAILURE", "time": elapsed}

                else:
                    step = data.get("message", "...")
                    progress = data.get("progress", 0)
                    print(f"[{index}] {status} — {step} ({progress}%)")

        except Exception as e:
            print(f"[{index}] Poll error — {e}")

        await asyncio.sleep(2)

async def run_load_test():
    print("=" * 50)
    print("ViralGen AI — Load Test (5 concurrent requests)")
    print("=" * 50)

    async with aiohttp.ClientSession() as session:
        print("\nSubmitting 5 jobs simultaneously...\n")
        submit_start = time.time()

        submit_tasks = [
            submit_job(session, payload, i + 1)
            for i, payload in enumerate(TEST_REQUESTS)
        ]
        results = await asyncio.gather(*submit_tasks)
        submit_elapsed = time.time() - submit_start

        print(f"\nAll 5 jobs submitted in {submit_elapsed:.2f}s")
        print("(Should be under 2s total — confirms server didn't block)\n")

        job_ids = [(r["index"], r["job_id"]) for r in results if r.get("job_id")]

        if not job_ids:
            print("No jobs submitted successfully — check if backend is running")
            return

        print(f"Polling {len(job_ids)} jobs...\n")
        poll_tasks = [
            poll_job(session, job_id, index)
            for index, job_id in job_ids
        ]
        poll_results = await asyncio.gather(*poll_tasks)

        print("\n" + "=" * 50)
        print("RESULTS SUMMARY")
        print("=" * 50)
        success = [r for r in poll_results if r.get("status") == "SUCCESS"]
        failed = [r for r in poll_results if r.get("status") == "FAILURE"]
        print(f"Success: {len(success)}/5")
        print(f"Failed:  {len(failed)}/5")
        if success:
            avg_time = sum(r["time"] for r in success) / len(success)
            print(f"Avg completion time: {avg_time:.0f}s")
        print("=" * 50)

if __name__ == "__main__":
    asyncio.run(run_load_test())